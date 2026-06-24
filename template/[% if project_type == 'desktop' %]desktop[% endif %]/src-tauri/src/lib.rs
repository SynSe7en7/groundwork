// The Tauri 2 app builder. Plugins are registered here. Desktop-only plugins
// (updater, deep-link) are gated by cfg so a future mobile target stays clean.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default().plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    {
        builder = builder
            .plugin(tauri_plugin_updater::Builder::new().build())
            .plugin(tauri_plugin_deep_link::init());
    }

    // Optional local SQLite. Uncomment here, in Cargo.toml, and in
    // capabilities/default.json to enable.
    // builder = builder.plugin(tauri_plugin_sql::Builder::default().build());

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
