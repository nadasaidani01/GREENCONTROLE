# esp32_api.py
import serial
import threading
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# === Serial config ===
SERIAL_PORT = "COM3"  # your ESP32 port
BAUD_RATE = 115200

ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)

# === Store latest data ===
latest_data = {}

# --- Function to continuously read from ESP32 ---
def read_serial():
    global latest_data
    while True:
        if ser.in_waiting:
            line = ser.readline().decode('utf-8').strip()
            if line:
                # Parse ESP32 output line (split by '|')
                if "°C" in line:  # crude filter
                    parts = line.split('|')
                    try:
                        print(line,"<===")
                        latest_data = {
                            "temperature": float(parts[0].replace("°C","").strip()),
                            "humidityAir": float(parts[1].replace("%💧","").strip()),
                            "humiditySoil": float(parts[2].replace("%💦","").strip()),
                            "rainPercent": float(parts[3].replace("%🌧","").strip()),
                            "water": parts[4].replace("💧 Eau","").strip(),
                            "lightPercent": str (parts[5].replace("%💡(🌙 Faible)","").strip()),
                            "pump": parts[6].replace("🚿","").strip()
                        }
                    except Exception as e:
                        print("Failed to parse:", line, e)

# --- Start thread to read serial data ---
threading.Thread(target=read_serial, daemon=True).start()

# --- FastAPI app ---
app = FastAPI()

# --- Enable CORS for all origins ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],  
)

@app.get("/api")
def get_data():
    if latest_data:
        return JSONResponse(content=latest_data)
    else:
        return JSONResponse(content={"error": "No data yet"})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
