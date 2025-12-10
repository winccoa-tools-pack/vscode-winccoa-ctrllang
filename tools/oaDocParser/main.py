#!/usr/bin/env python3
"""
WinCC OA Documentation Parser

Crawls WinCC OA documentation and generates function definition JSON files.
"""

import sys
from pathlib import Path

# Add parser directory to path
sys.path.insert(0, str(Path(__file__).parent / "parser"))

from crawl import build_index
from generate_buildins import build_builtins, SOURCE_PATH, TARGET_PATH


def main():
    print("="*60)
    print("WinCC OA Documentation Parser")
    print("="*60)
    print()
    
    print("Step 1: Crawling WinCC OA documentation...")
    print("-" * 60)
    
    # Run crawler
    functions = build_index()
    
    if not functions:
        print("\n[ERROR] No functions crawled. Exiting.")
        return 1
    
    print()
    print("Step 2: Generating cleaned function definitions...")
    print("-" * 60)
    
    # Generate cleaned builtins
    build_builtins(SOURCE_PATH, TARGET_PATH)
    
    print()
    print("="*60)
    print("✅ Documentation parsing complete!")
    print("="*60)
    print(f"Output files:")
    print(f"  - {SOURCE_PATH}")
    print(f"  - {TARGET_PATH}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())