import sys
import os
import argparse
import json
from datetime import datetime
import logging

logging.basicConfig(
    level=logging.INFO,
    handlers=[
        logging.FileHandler("parser.log"),
        logging.StreamHandler(sys.stdout)
    ],
    format='%(asctime)s - %(levelname)s - %(message)s'
)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from company_parser import CompanyParser
from config import TEST_INNS, DEFAULT_OUTPUT_JSON

def main():
    
    parser = argparse.ArgumentParser(description="Парсер компаний с list-org.com")
    parser.add_argument(
        '--inn', 
        type=str, 
        help="Один ИНН или несколько ИНН через запятую (напр. 7707083893,7705439333)"
    )
    parser.add_argument(
        '--file', 
        type=str, 
        help="Путь к .txt файлу со списком ИНН (по одному на строку)"
    )
    parser.add_argument(
        '--output', 
        type=str, 
        default=DEFAULT_OUTPUT_JSON, 
        help=f"Путь к файлу .json для сохранения результатов (по умолч.: {DEFAULT_OUTPUT_JSON})"
    )
    args = parser.parse_args()

    inns_to_parse = []
    
    if args.inn:
        inns_to_parse = [inn.strip() for inn in args.inn.split(',')]
        logging.info(f"Получены ИНН из аргумента --inn: {len(inns_to_parse)} шт.")
    
    elif args.file:
        try:
            with open(args.file, 'r', encoding='utf-8') as f:
                inns_to_parse = [line.strip() for line in f if line.strip()]
            if not inns_to_parse:
                logging.error(f"Файл {args.file} пуст или не содержит ИНН.")
                sys.exit(1)
            logging.info(f"Загружены ИНН из файла {args.file}: {len(inns_to_parse)} шт.")
        except FileNotFoundError:
            logging.error(f"Файл не найден: {args.file}")
            sys.exit(1)
        except Exception as e:
            logging.error(f"Ошибка чтения файла {args.file}: {e}")
            sys.exit(1)
            
    else:
        logging.warning("ИНН не переданы. Используются тестовые ИНН из config.py")
        inns_to_parse = TEST_INNS
    
    if not inns_to_parse:
        logging.error("Нет ИНН для парсинга. Завершение работы.")
        sys.exit(0)

    logging.info("=" * 60)
    logging.info(f"ЗАПУСК ПАРСИНГА. Всего компаний: {len(inns_to_parse)}")
    logging.info("=" * 60)
    
    parser = CompanyParser()
    try:
        results = parser.parse_companies(inns_to_parse)
        
        successful_data = []
        for res in results:
            if res.success and res.data:
                successful_data.append(res.data.to_dict())


        if args.inn and len(inns_to_parse) == 1:
            print("\n" + "=" * 60)
            print("РЕЗУЛЬТАТ ПАРСИНГА (JSON):")
            print("=" * 60)
            if successful_data:
                print(json.dumps(successful_data[0], ensure_ascii=False, indent=4))
            else:
                print(f"Не удалось получить данные для ИНН: {inns_to_parse[0]}")
                if results[0].error:
                    print(f"Ошибка: {results[0].error}")
            print("=" * 60)
        
        if successful_data:
            try:
                os.makedirs(os.path.dirname(args.output), exist_ok=True)
                
                with open(args.output, 'w', encoding='utf-8') as f:
                    json.dump(successful_data, f, ensure_ascii=False, indent=4)
                logging.info(f"✓ Результаты успешно сохранены в: {args.output}")
            except Exception as e:
                logging.error(f"Не удалось сохранить JSON файл {args.output}: {e}")
        else:
            logging.warning("Нет успешных результатов для сохранения в JSON.")

        stats = parser.get_statistics()
        logging.info("\n" + "=" * 60)
        logging.info("СТАТИСТИКА ПАРСИНГА")
        logging.info("=" * 60)
        logging.info(f"Всего компаний обработано: {stats['total_companies']}")
        logging.info(f"Успешно спарсено: {stats['successful_parses']}")
        logging.info(f"Ошибок: {stats['failed_parses']}")
        logging.info(f"Процент успеха: {stats['success_rate']}")
        logging.info(f"Использованные источники: {', '.join(stats['sources_used'])}")
        logging.info("=" * 60)
        
    except KeyboardInterrupt:
        logging.warning("Парсинг прерван пользователем")
        sys.exit(1)
    except Exception as e:
        logging.error(f"Критическая ошибка в main: {e}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    main()