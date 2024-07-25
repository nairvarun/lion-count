#!/bin/python
import pandas
import argparse


def main():
    parser = argparse.ArgumentParser(description="Process some integers.")
    parser.add_argument(
        "file",
        metavar="file",
        type=str,
        nargs=1,
        help="input file",
    )
    parser.add_argument(
        "sheet",
        metavar="sheet",
        type=str,
        nargs=1,
        help="input file",
    )
    parser.add_argument(
        "column",
        metavar="column",
        type=str,
        nargs=1,
        help="input file",
    )
    args = parser.parse_args()
    df = pandas.read_excel(args.file[0], sheet_name=args.sheet[0])

    matched_lines = df[df[args.column[0]].str.match(r"\d{2}[A-Z]{3}\d{5}")]
    matched_lines.reset_index(drop=True, inplace=True)
    matched_lines.index += 1
    print(matched_lines.to_string())


if __name__ == "__main__":
    main()
