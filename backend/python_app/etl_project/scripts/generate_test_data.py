
import random
import argparse
from pathlib import Path

def generate_realistic_inn():
    region = random.randint(1, 99)
    region_str = f"{region:02d}"
    random_part = ''.join([str(random.randint(0, 9)) for _ in range(8)])
    control_sum = random.randint(10, 99)
    return f"{region_str}{random_part}{control_sum}"

def generate_test_companies(count: int, output_file: str):
    inns = set()
    
    known_inns = [
        "7707083893",
        "7702001997",
        "7706022462",
        "7736050003",
        "7702070139",
        "7707049388",
        "7705031674",
        "7708004767",
        "7707049388",
        "7705031674",
    ]
    
    for inn in known_inns:
        inns.add(inn)
    
    while len(inns) < count:
        inns.add(generate_realistic_inn())
    
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for inn in sorted(inns):
            f.write(f"{inn}\n")
    
    print(f"✅ Сгенерировано {len(inns)} уникальных ИНН в файл {output_file}")
    return len(inns)

def main():
    parser = argparse.ArgumentParser(description='Генератор тестовых данных для ETL')
    parser.add_argument('--count', type=int, default=200, 
                       help='Количество компаний для генерации (по умолчанию 200)')
    parser.add_argument('--output', type=str, default='input/inn_list_load_test.txt',
                       help='Путь к выходному файлу')
    
    args = parser.parse_args()
    
    print(f"🚀 Генерация тестовых данных для нагрузочного тестирования...")
    print(f"📊 Количество компаний: {args.count}")
    print(f"📁 Выходной файл: {args.output}")
    
    count = generate_test_companies(args.count, args.output)
    
    print(f"✅ Готово! Создан файл с {count} уникальными ИНН")
    print(f"📋 Для запуска нагрузочного тестирования:")
    print(f"   cp {args.output} input/inn_list.txt")
    print(f"   make etl-run")

if __name__ == "__main__":
    main()
