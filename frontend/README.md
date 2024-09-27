## フロントエンド実行方法

### 1. frontend ディレクトリに移動

```bash
cd frontend
```

### 2. 実行

```bash
npm run dev
```

### 3. json-server の実行方法(フロントエンドのみでテストしたい場合)

別ターミナルで以下のコマンドを実行する。

```bash
npx json-server --watch data.json -p 3000
```

※ フェッチ先のエンドポイントも変更する。
