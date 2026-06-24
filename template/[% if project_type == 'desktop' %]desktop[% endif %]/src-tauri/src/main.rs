// Prevents an extra console window on Windows in release; comment out to debug.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    app_lib::run();
}
