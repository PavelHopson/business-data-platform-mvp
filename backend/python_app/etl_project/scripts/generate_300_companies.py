
import random
import argparse
import sys
import os

def generate_inn():
    region_codes = ['77', '78', '50', '40', '32', '61', '34', '66', '59', '63']
    region = random.choice(region_codes)
    
    inn_part = ''.join([str(random.randint(0, 9)) for _ in range(8)])
    inn = region + inn_part
    
    return inn

def main():
    parser = argparse.ArgumentParser(description='Generate test INN data for load testing')
    parser.add_argument('--count', type=int, default=350, help='Number of INNs to generate')
    parser.add_argument('--output', default='input/inn_list_load_test_300.txt', help='Output file')
    
    args = parser.parse_args()
    
    inns = set()
    while len(inns) < args.count:
        inns.add(generate_inn())
    
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    with open(args.output, 'w') as f:
        for inn in sorted(inns):
            f.write(f"{inn}\n")
    
    print(f"Generated {len(inns)} unique INNs in {args.output}")

if __name__ == "__main__":
    main()
