from __future__ import annotations

import argparse
import math
import re
import struct
import sys
import time
import uuid
from array import array
from dataclasses import dataclass, field
from datetime import datetime, date, timezone
from pathlib import Path

try:
    from app.database.db import SessionLocal, engine, Base
    from app.models.climate import ClimateData
except ImportError:
    sys.path.insert(0, str(Path(__file__).parent.parent / "server"))
    from app.database.db import SessionLocal, engine, Base
    from app.models.climate import ClimateData

from sqlalchemy import text as sa_text

db_url = str(engine.url) if hasattr(engine, 'url') else ""
use_postgis = db_url.startswith("postgresql")

has_postgis_geom = False
WKTElement = None
if use_postgis:
    try:
        from geoalchemy2 import WKTElement
        has_postgis_geom = True
    except ImportError:
        pass


@dataclass
class GridConfig:
    lat_rows: int
    lon_cols: int
    lat_start: float
    lon_start: float
    step: float
    nodata: float
    description: str = ""


GRID_PROFILES: dict[str, GridConfig] = {
    "rainfall": GridConfig(
        lat_rows=129, lon_cols=135,
        lat_start=6.5, lon_start=66.5,
        step=0.25, nodata=-999.0,
        description="0.25° grid (129 lat × 135 lon)"
    ),
    "max_temp": GridConfig(
        lat_rows=31, lon_cols=31,
        lat_start=6.5, lon_start=66.5,
        step=1.0, nodata=99.9,
        description="1.0° grid (31 × 31)"
    ),
    "min_temp": GridConfig(
        lat_rows=31, lon_cols=31,
        lat_start=6.5, lon_start=66.5,
        step=1.0, nodata=99.9,
        description="1.0° grid (31 × 31)"
    ),
}


VARIABLE_PATTERNS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"Rainfall", re.I), "rainfall"),
    (re.compile(r"MaxTemp|Maxtemp|MaxT|maximum[_ ]?temperature", re.I), "max_temp"),
    (re.compile(r"MinTemp|Mintemp|MinT|minimum[_ ]?temperature", re.I), "min_temp"),
    (re.compile(r"Temp", re.I), "max_temp"),
]

YEAR_PATTERN = re.compile(r"(19|20)\d{2}")


def detect_variable(filename: str) -> str:
    for pattern, var in VARIABLE_PATTERNS:
        if pattern.search(filename):
            return var
    return "rainfall"


def detect_year(filename: str) -> int | None:
    match = YEAR_PATTERN.search(filename)
    return int(match.group()) if match else None


def load_floats(path: Path, nodata: float) -> array:
    raw = path.read_bytes()
    if len(raw) % 4 != 0:
        raise ValueError(f"File size not multiple of 4 bytes: {len(raw)}")

    first_little = struct.unpack("<f", raw[:4])[0]
    first_big = struct.unpack(">f", raw[:4])[0]

    floats = array("f")
    floats.frombytes(raw)
    if sys.byteorder != "little":
        floats.byteswap()

    if abs(first_little - nodata) < 1e-6 or (math.isfinite(first_little) and abs(first_little) < 1e7):
        return floats

    swapped = array("f")
    swapped.frombytes(raw)
    swapped.byteswap()
    if abs(first_big - nodata) < 1e-6 or (math.isfinite(first_big) and abs(first_big) < 1e7):
        return swapped

    return floats


def is_leap(year: int) -> bool:
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    return year % 4 == 0


def days_in_month(month: int, leap: bool) -> int:
    normal = (0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
    leap_days = (0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
    return leap_days[month] if leap else normal[month]


def generate_dates(year: int):
    leap = is_leap(year)
    for month in range(1, 13):
        for day in range(1, days_in_month(month, leap) + 1):
            yield date(year, month, day)


def grid_to_rows(values: array, day_index: int, cfg: GridConfig) -> list[tuple[float, float, float]]:
    start = day_index * cfg.lat_rows * cfg.lon_cols
    day_values = values[start:start + cfg.lat_rows * cfg.lon_cols]
    lon_vals = [cfg.lon_start + j * cfg.step for j in range(cfg.lon_cols)]
    lat_vals = [cfg.lat_start + i * cfg.step for i in range(cfg.lat_rows)]

    records: list[tuple[float, float, float]] = []
    append = records.append
    for i, lat in enumerate(lat_vals):
        for j, lon in enumerate(lon_vals):
            val = day_values[i * cfg.lon_cols + j]
            if abs(val - cfg.nodata) < 0.01:
                continue
            append((lat, lon, round(val, 2)))
    return records


def ensure_table():
    Base.metadata.create_all(bind=engine)


def drop_and_recreate_table():
    ClimateData.__table__.drop(bind=engine, checkfirst=True)
    ensure_table()
    # also create PostGIS extension
    if use_postgis:
        with engine.connect() as conn:
            conn.execute(sa_text("CREATE EXTENSION IF NOT EXISTS postgis"))
            conn.commit()
    print("Table climate_data recreated.")


def get_ingested_days(db, year: int, variable: str) -> set[int]:
    source_tag = f"imd_{variable}_{year}"
    from sqlalchemy import func
    rows = db.query(
        func.extract('doy', ClimateData.date),
        func.count(ClimateData.id)
    ).filter(
        ClimateData.source == source_tag
    ).group_by(
        func.extract('doy', ClimateData.date)
    ).all()
    return {int(r[0]) for r in rows}


def ingest_file(
    path: Path,
    year: int | None = None,
    variable: str | None = None,
    max_days: int | None = None,
    force: bool = False,
) -> dict:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    if variable is None:
        variable = detect_variable(path.name)
    if year is None:
        detected = detect_year(path.name)
        if detected is None:
            raise ValueError(f"Could not detect year from filename: {path.name}")
        year = detected

    cfg = GRID_PROFILES.get(variable)
    if cfg is None:
        raise ValueError(f"Unknown variable '{variable}'. Known: {list(GRID_PROFILES.keys())}")

    print(f"File:     {path.name}")
    print(f"Variable: {variable}")
    print(f"Grid:     {cfg.description}")

    values = load_floats(path, cfg.nodata)
    total_vals = len(values)
    daily_cells = cfg.lat_rows * cfg.lon_cols
    if total_vals % daily_cells != 0:
        raise ValueError(f"File size {total_vals} not divisible by grid {cfg.lat_rows}x{cfg.lon_cols}={daily_cells}")
    num_days = total_vals // daily_cells

    leap = is_leap(year)
    expected = 366 if leap else 365
    if num_days != expected:
        print(f"Warning: Found {num_days} daily records, expected {expected} for year {year}")

    dates = list(generate_dates(year))
    if len(dates) < num_days:
        dates = dates[:num_days]

    limit_days = min(num_days, max_days) if max_days else num_days

    print(f"Daily records: {limit_days} / {num_days}")
    print(f"Cells/day:     {daily_cells}  ({cfg.lat_rows} lat × {cfg.lon_cols} lon)")
    print(f"DB:            {'PostgreSQL+PostGIS' if use_postgis else 'SQLite'}")
    print()

    ensure_table()
    db = SessionLocal()
    try:
        already_done = get_ingested_days(db, year, variable)
        if already_done and not force:
            print(f"Found {len(already_done)} days already ingested ({variable}/{year}).")
            print("Use --force to re-ingest all days, or --max-days to add more.")
            if len(already_done) >= limit_days:
                print("All days already ingested. Nothing to do.")
                return {"status": "skipped", "variable": variable, "year": year}

        source_tag = f"imd_{variable}_{year}"
        total_inserted = 0
        total_skipped = 0
        start_time = time.time()

        climate_table = ClimateData.__table__
        commit_interval = 30

        pending: list[dict] = []
        for day_idx in range(limit_days):
            doy = day_idx + 1
            if doy in already_done and not force:
                total_skipped += daily_cells
                continue

            rows = grid_to_rows(values, day_idx, cfg)
            current_date = dates[day_idx] if day_idx < len(dates) else date(year, 1, 1)
            dt_val = datetime.combine(current_date, datetime.min.time())

            now = datetime.now(timezone.utc)
            for lat, lon, val in rows:
                rec: dict = {
                    "id": str(uuid.uuid4()),
                    "region": "India",
                    "state": "",
                    "district": "",
                    "date": dt_val,
                    "lat": lat,
                    "lon": lon,
                    "source": source_tag,
                    "created_at": now,
                    "updated_at": now,
                    variable: val,
                }
                if has_postgis_geom and WKTElement is not None:
                    rec["geom"] = WKTElement(f"POINT({lon} {lat})", srid=4326)
                pending.append(rec)

            total_inserted += len(rows)

            skipped_from_nodata = daily_cells - len(rows)
            total_skipped += skipped_from_nodata

            if (day_idx + 1) % commit_interval == 0 or day_idx == limit_days - 1:
                if pending:
                    if use_postgis:
                        from sqlalchemy.dialects.postgresql import insert as pg_insert
                        stmt = pg_insert(climate_table).values(pending)
                        stmt = stmt.on_conflict_do_update(
                            constraint="uq_climate_date_lat_lon",
                            set_={variable: stmt.excluded[variable],
                                  "updated_at": stmt.excluded["updated_at"]}
                        )
                        db.execute(stmt)
                    else:
                        db.execute(climate_table.insert(), pending)
                    db.commit()
                    pending = []

            if (day_idx + 1) % 30 == 0 or day_idx == 0 or day_idx == limit_days - 1:
                elapsed = time.time() - start_time
                rate = total_inserted / elapsed if elapsed > 0 else 0
                print(f"  Day {day_idx + 1}/{limit_days} | Inserted: {total_inserted:,} | "
                      f"Skipped: {total_skipped:,} | {rate:.0f} rows/s | {elapsed:.1f}s")

        if pending:
            if use_postgis:
                from sqlalchemy.dialects.postgresql import insert as pg_insert
                stmt = pg_insert(climate_table).values(pending)
                stmt = stmt.on_conflict_do_update(
                    constraint="uq_climate_date_lat_lon",
                    set_={variable: stmt.excluded[variable],
                          "updated_at": stmt.excluded["updated_at"]}
                )
                db.execute(stmt)
            else:
                db.execute(climate_table.insert(), pending)
            db.commit()

        elapsed = time.time() - start_time
        rate = total_inserted / elapsed if elapsed > 0 else 0
        print(f"\nDone! Inserted {total_inserted:,} rows in {elapsed:.1f}s ({rate:.0f} rows/s)")
        print(f"Skipped {total_skipped:,} NODATA grid cells")

        return {
            "status": "success",
            "variable": variable,
            "year": year,
            "grid": cfg.description,
            "rows_inserted": total_inserted,
            "rows_skipped": total_skipped,
            "elapsed_seconds": round(elapsed, 1),
        }
    finally:
        db.close()


def summarize_file(path: Path) -> dict:
    path = Path(path)
    variable = detect_variable(path.name)
    cfg = GRID_PROFILES.get(variable)
    if cfg is None:
        return {"file": path.name, "error": f"Unknown variable type"}

    values = load_floats(path, cfg.nodata)
    total = len(values)
    daily_cells = cfg.lat_rows * cfg.lon_cols
    num_days = total // daily_cells if total % daily_cells == 0 else 0

    valid = 0
    missing = 0
    for v in values:
        if abs(v - cfg.nodata) < 0.01:
            missing += 1
        else:
            valid += 1

    return {
        "file": path.name,
        "size_bytes": path.stat().st_size,
        "total_values": total,
        "grid": cfg.description,
        "daily_cells": daily_cells,
        "num_days": num_days,
        "valid_values": valid,
        "nodata_values": missing,
        "variable": variable,
        "year": detect_year(path.name),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="ETL: ingest IMD .grd binary files into PostgreSQL")
    parser.add_argument("file", nargs="?", help="Path to .grd file (auto-detect if omitted)")
    parser.add_argument("--year", type=int, help="Override detected year")
    parser.add_argument("--variable", choices=list(GRID_PROFILES.keys()), help="Override detected variable")
    parser.add_argument("--max-days", type=int, help="Limit number of days to ingest (for testing)")
    parser.add_argument("--force", action="store_true", help="Re-ingest already ingested days")
    parser.add_argument("--summarize", action="store_true", help="Just show file summary, don't ingest")
    parser.add_argument("--db-only", action="store_true", help="Only create DB tables, don't ingest")
    parser.add_argument("--recreate-table", action="store_true", help="Drop and recreate climate_data table")

    args = parser.parse_args()

    if args.recreate_table:
        drop_and_recreate_table()
        return 0

    if args.db_only:
        ensure_table()
        print("Database tables created/verified.")
        return 0

    if args.summarize:
        if not args.file:
            grd_files = list(Path.cwd().glob("*.grd"))
            if not grd_files:
                print("No .grd files found in current directory.")
                return 1
            for f in grd_files:
                s = summarize_file(f)
                print(f"\n{s['file']}:")
                for k, v in s.items():
                    if k != "file":
                        print(f"  {k}: {v}")
        else:
            s = summarize_file(args.file)
            for k, v in s.items():
                print(f"{k}: {v}")
        return 0

    if not args.file:
        grd_files = list(Path.cwd().glob("*.grd"))
        if not grd_files:
            print("No .grd files found. Provide a path or run in the project directory.")
            return 1
        for f in grd_files:
            ingest_file(f, year=args.year, variable=args.variable, max_days=args.max_days, force=args.force)
    else:
        result = ingest_file(args.file, year=args.year, variable=args.variable, max_days=args.max_days, force=args.force)
        print(f"\nResult: {result}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
