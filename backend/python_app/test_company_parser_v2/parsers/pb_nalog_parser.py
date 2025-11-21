import os
import time
import json
import re
import random
import pandas as pd
from typing import Optional, Dict, Any
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from .base_parser import BaseParser
from config import PB_NALOG_TABLE_DIR, PB_NALOG_JSON_DIR
import logging

class PbNalogParser(BaseParser):
    """
    Парсер для pb.nalog.ru с продвинутой маскировкой 
    и управлением сессией.
    """

    def __init__(self):
        logging.info("Инициализация PbNalogParser...")
        
        # 1. Настраиваем пути
        self.pb_nalog_table_dir = os.path.abspath(PB_NALOG_TABLE_DIR)
        self.pb_nalog_json_dir = os.path.abspath(PB_NALOG_JSON_DIR)
        
        os.makedirs(self.pb_nalog_table_dir, exist_ok=True)
        os.makedirs(self.pb_nalog_json_dir, exist_ok=True)
        
        logging.info(f"Директория для XLSX: {self.pb_nalog_table_dir}")
        logging.info(f"Директория для JSON: {self.pb_nalog_json_dir}")

        # 2. Настраиваем опции Chrome для маскировки
        chrome_options = Options()
        chrome_options.add_argument("--headless") 
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--remote-debugging-port=9222")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-plugins")
        chrome_options.add_argument("--disable-images")
        chrome_options.add_argument("--disable-background-timer-throttling")
        chrome_options.add_argument("--disable-backgrounding-occluded-windows")
        chrome_options.add_argument("--disable-renderer-backgrounding")
        chrome_options.add_argument("--disable-features=TranslateUI")
        chrome_options.add_argument("--disable-ipc-flooding-protection")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--disable-client-side-phishing-detection")
        chrome_options.add_argument("--disable-sync")
        chrome_options.add_argument("--disable-default-apps")
        chrome_options.add_argument("--disable-hang-monitor")
        chrome_options.add_argument("--disable-prompt-on-repost")
        chrome_options.add_argument("--disable-domain-reliability")
        chrome_options.add_argument("--disable-component-extensions-with-background-pages")
        chrome_options.add_argument("--disable-background-networking")
        chrome_options.add_argument("--disable-features=TranslateUI,BlinkGenPropertyTrees")
        
        # --- НОВЫЕ ОПЦИИ ДЛЯ МАСКИРОВКИ ---
        # 2.1. Устанавливаем "человеческий" User-Agent
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        chrome_options.add_argument(f'user-agent={user_agent}')
        
        # 2.2. Отключаем флаги, которые "выдают" Selenium
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # 2.3. Настраиваем папку для загрузок
        prefs = {
            "download.default_directory": self.pb_nalog_table_dir,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True,
            "profile.default_content_setting_values.notifications": 2,
            "profile.default_content_settings.popups": 0,
            "profile.managed_default_content_settings.images": 2,
            "profile.content_settings.exceptions.automatic_downloads.*.setting": 1,
            "profile.default_content_setting_values.media_stream": 2,
            "profile.default_content_setting_values.geolocation": 2,
            "profile.default_content_setting_values.camera": 2,
            "profile.default_content_setting_values.microphone": 2
        }
        chrome_options.add_experimental_option("prefs", prefs)

        # 3. Инициализируем драйвер ОДИН РАЗ при создании объекта
        logging.info("Инициализация ChromeDriver...")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10) # Уменьшаем таймаут до 10 секунд
        
        # 2.4. Дополнительный JS для удаления следов Selenium
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        logging.info("Драйвер инициализирован и замаскирован.")

    def close(self):
        """Метод для корректного закрытия браузера."""
        if self.driver:
            logging.info("Закрываем драйвер Selenium")
            self.driver.quit()
            self.driver = None

    def __enter__(self):
        """Для использования в 'with'"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Автоматически закрывает драйвер при выходе из 'with'"""
        self.close()

    def parse_company(self, inn: str) -> Optional[Dict[str, Any]]:
        """
        Парсит ОДНУ компанию, используя ОБЩИЙ экземпляр браузера.
        """
        logging.info(f"Парсинг {inn} с pb.nalog.ru...")
        
        final_xlsx_path = self._download_nalog_report(inn, self.pb_nalog_table_dir)
        
        if not final_xlsx_path:
            logging.warning(f"Скачивание XLSX не удалось для {inn}")
            return None
        
        pb_nalog_json = self._process_excel_to_json(final_xlsx_path, inn)
        
        if pb_nalog_json:
            json_filename = f"{inn}_pb_nalog.json"
            json_filepath = os.path.join(self.pb_nalog_json_dir, json_filename)
            with open(json_filepath, 'w', encoding='utf-8') as f:
                json.dump(pb_nalog_json, f, ensure_ascii=False, indent=2)
            logging.info(f"JSON сохранен: {json_filepath}")
            return pb_nalog_json
        
        return None

    def _download_nalog_report(self, inn: str, download_dir: str) -> Optional[str]:
        """
        Загружает отчет .xlsx, используя СУЩЕСТВУЮЩИЙ драйвер (self.driver).
        """
        final_xlsx_path = None
        
        try:
            logging.info(f"Переход на https://pb.nalog.ru/search-ext.html (ИНН: {inn})")
            # Мы переходим на страницу поиска КАЖДЫЙ РАЗ, чтобы сбросить состояние
            self.driver.get("https://pb.nalog.ru/search-ext.html")
            
            # Добавляем "человеческие" задержки
            time.sleep(random.uniform(1, 2)) 

            logging.info("Ожидаем поле ввода ИНН (ID: queryUlExt)")
            search_box = self.wait.until(EC.presence_of_element_located((By.ID, "queryUlExt")))
            
            time.sleep(random.uniform(0.5, 1)) # Пауза перед вводом
            
            logging.info(f"Вводим ИНН {inn}")
            search_box.send_keys(inn)
            
            time.sleep(random.uniform(0.3, 0.7)) # Пауза перед поиском
            
            # Нажимаем кнопку "Найти" вместо Enter
            logging.info("Ищем и нажимаем кнопку 'Найти'")
            find_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Найти')]")))
            find_button.click()
            
            # Пауза, чтобы "посмотреть" на результаты поиска
            time.sleep(random.uniform(1, 2)) 

            logging.info("Ожидаем кнопку загрузки (ID: downloadSearchResultLnk)")
            download_button = self.wait.until(EC.element_to_be_clickable((By.ID, "downloadSearchResultLnk")))

            logging.info("Найдена кнопка 'Скачать'. Начинаю загрузку...")
            time.sleep(random.uniform(0.5, 1)) # Пауза перед кликом

            target_filename = f"pb_nalog_{inn}.xlsx"
            target_filepath = os.path.join(download_dir, target_filename)

            if os.path.exists(target_filepath):
                logging.info(f"Удаляю старый файл: {target_filepath}")
                os.remove(target_filepath)

            files_before = set(os.listdir(download_dir))
            
            download_button.click()

            timeout = 30  # Уменьшаем таймаут до 30 секунд
            start_time = time.time()
            temp_file_path = None
            
            logging.info("Ожидаем завершения загрузки файла")
            while time.time() - start_time < timeout:
                files_after = set(os.listdir(download_dir))
                new_files = files_after - files_before
                
                if new_files:
                    temp_file_name = new_files.pop()
                    if not temp_file_name.endswith('.crdownload'):
                        temp_file_path = os.path.join(download_dir, temp_file_name)
                        logging.info(f"Обнаружен скачанный файл: {temp_file_name}")
                        break
                
                time.sleep(0.5)

            if temp_file_path:
                # Дополнительная проверка на .crdownload
                while os.path.exists(temp_file_path + ".crdownload"):
                    logging.info("Ожидаем завершения загрузки (.crdownload всё ещё присутствует)")
                    time.sleep(0.1)
                
                # Даем файловой системе "вздохнуть" перед переименованием
                time.sleep(0.5) 
                
                logging.info(f"Переименовываю '{temp_file_name}' в '{target_filename}'")
                os.rename(temp_file_path, target_filepath)
                final_xlsx_path = target_filepath
                logging.info(f"Успешно! Файл сохранен: {final_xlsx_path}")
            else:
                logging.error(f"Файл не был загружен за {timeout} секунд для ИНН {inn}")

        except Exception as e:
            logging.error(f"Произошла ошибка Selenium: {str(e)}", exc_info=True)
            # Если произошла ошибка, делаем скриншот для отладки
            try:
                self.driver.save_screenshot(os.path.join(self.pb_nalog_json_dir, f"error_screenshot_{inn}.png"))
                logging.info(f"Скриншот ошибки сохранен в {self.pb_nalog_json_dir}")
            except Exception as se:
                logging.error(f"Не удалось сохранить скриншот: {se}")
                
        return final_xlsx_path

    def _process_excel_to_json(self, xlsx_filepath: str, inn: str) -> Optional[Dict[str, Any]]:
        logging.info(f"Начинаю обработку файла: {xlsx_filepath}")
        
        try:
            df = pd.read_excel(xlsx_filepath, sheet_name=0, header=None, engine='openpyxl')
            logging.info(f"XLSX прочитан, размер таблицы: {df.shape}")
            
            status = df.iat[5, 0]
            inn_from_file = df.iat[5, 2]
            name = df.iat[5, 3]
            activity_raw = str(df.iat[5, 5])
            logging.info(f"Извлечено: status={status}, inn={inn_from_file}, name={name}, activity={activity_raw}")
            
            code = ""
            desc = ""
            match = re.match(r"^\s*([\d\.]+)\s+(.*)\s*$", activity_raw)
            if match:
                code = match.group(1)
                desc = match.group(2)
            else:
                desc = activity_raw
                logging.warning(f"Не удалось распознать код в ячейке F6: '{activity_raw}'")

            pb_nalog_json = {
                "inn": str(inn_from_file),
                "name": str(name),
                "status": str(status),
                "activity": {
                    "code": code,
                    "desc": desc
                }
            }
            
            logging.info(f"JSON успешно создан: {pb_nalog_json}")
            return pb_nalog_json

        except Exception as e:
            logging.error(f"Ошибка при обработке Excel/JSON: {e}", exc_info=True)
            return None