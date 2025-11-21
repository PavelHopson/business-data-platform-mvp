import argparse
import sys
from process_company import process_companies, setup_logging
from typing import List

def parse_inns_from_file(file_path: str) -> List[str]:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return [line.strip() for line in f if line.strip()]
    except Exception as e:
        logging.error(f"Ошибка чтения файла {file_path}: {e}")
        return []

def main():
    parser = argparse.ArgumentParser(description="Парсер данных о компаниях по ИНН")
    parser.add_argument('--inn', type=str, help="ИНН компании или список ИНН через запятую")
    parser.add_argument('--file', type=str, help="Путь к файлу с ИНН")
    parser.add_argument('--output', type=str, default="output/final_JSON/output.json", help="Путь к выходному JSON файлу")
    args = parser.parse_args()

    setup_logging()

    inns_to_parse = []
    if args.inn:
        inns_to_parse = args.inn.split(',')
    elif args.file:
        inns_to_parse = parse_inns_from_file(args.file)
    
    if not inns_to_parse:
        logging.error("Не указаны ИНН для парсинга")
        sys.exit(1)

    process_companies(inns_to_parse, args.output)

if __name__ == "__main__":
    main()