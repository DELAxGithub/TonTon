#!/bin/bash

# デバッグモードを有効化
set -x

# スクリプトのディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# ドキュメントのバックアップディレクトリ
BACKUP_DIR="$PROJECT_ROOT/.docs_backup"

# プロジェクトのドキュメントディレクトリ
DOC_PATHS=(
    "docs/**/*.md"
    "docs/**/*.adoc"
    "*.md"
    "PROJECT_RULES.md"
)

# バックアップディレクトリの作成
mkdir -p "$BACKUP_DIR"

# ドキュメントファイルのバックアップ
backup_docs() {
    echo "バックアップを開始します..."
    cd "$PROJECT_ROOT"
    for pattern in "${DOC_PATHS[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ] && [[ ! "$file" =~ node_modules ]] && [[ ! "$file" =~ ios/Pods ]]; then
                dir="$BACKUP_DIR/$(dirname "$file")"
                mkdir -p "$dir"
                cp "$file" "$dir/"
                echo "バックアップしました: $file"
            fi
        done
    done
    echo "バックアップが完了しました"
}

# ドキュメントの復元
restore_docs() {
    echo "ドキュメントの復元を開始します..."
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        find . -type f \( -name "*.md" -o -name "*.adoc" \) | while read file; do
            target_dir="$PROJECT_ROOT/$(dirname "$file")"
            mkdir -p "$target_dir"
            cp "$file" "$target_dir/"
            echo "復元しました: $file"
        done
        cd "$PROJECT_ROOT"
        rm -rf "$BACKUP_DIR"
        echo "復元が完了しました"
    else
        echo "バックアップが見つかりません"
    fi
}

case "$1" in
    "backup")
        backup_docs
        ;;
    "restore")
        restore_docs
        ;;
    *)
        echo "Usage: $0 {backup|restore}"
        exit 1
        ;;
esac 