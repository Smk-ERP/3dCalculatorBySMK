@echo off
rem ─────────────────────────────────────────────────────────────────────
rem  Opens the calculator in your default browser.
rem  No server. No internet. No waiting.
rem  %~dp0 = this file's own folder, so the whole folder can be moved.
rem ─────────────────────────────────────────────────────────────────────
start "" "%~dp0index.html"
