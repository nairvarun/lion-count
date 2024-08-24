#!/bin/python
import pandas as pd
import argparse
import re


def main():
    parser = argparse.ArgumentParser(description="Process some integers.")
    parser.add_argument(
        "file",
        metavar="file",
        type=str,
        nargs=1,
        help="input file",
    )

    args = parser.parse_args()
    # df = pd.read_excel(args.file[0], sheet_name=args.sheet[0])
    df = pd.read_excel(args.file[0])
    for col in df.columns:
        val = str(df[col].iloc[0])
        if re.match(r"\d{2}\w{3}\d{1,5}", val) is None:
            continue

        matched_lines = df[df[col].str.match(r"\d{2}[A-Z]{3}\d{5}", na=False)]
        matched_lines.reset_index(drop=True, inplace=True)
        matched_lines.index += 1
        print(matched_lines.to_string())
        break


if __name__ == "__main__":
    main()
