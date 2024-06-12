const express = require('express');
const pg = require("pg");
const app = express();

// HTMLファイルをホストするディレクトリを指定する
app.use(express.static('public/'));

// フォームデータをパースするためのミドルウェア
app.use(express.urlencoded({extended:true}));

// ビューエンジンにejsをセットする
app.set("view engine","ejs");
app.engine('ejs', require('ejs').__express);

const pool = new pg.Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,

  // Render.comのDBではSSLが求められる
  ssl: {
    rejectUnauthorized: false, // 証明書の検証はいったん無しで
  },
  max: 10,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle clients', err);
  process.exit(-1); // アプリケーションの異常終了
});

app.get('/', (req, res) => {
  pool.query('SELECT * FROM todo',(err, results) => {
      if(err){
        console.log('psqlエラー(select):' + err.stack);
        return;
      }
      res.render('index.ejs',{todos:results});
    }
  );
});

app.post('/add', (req, res) => {
  const text = req.body.text;
  const insertQuery = 'INSERT INTO todo (text, checked) VALUES (?, ?)';
  pool.query(insertQuery, [text, false], (err, results) => {
    if (err) {
      console.error('psqlエラー(insert):', err);
      return res.status(500).json({ error: 'タスクの追加に失敗しました。' });
    }
    res.redirect('/');
  });
});

app.post('/delete/:id',(req,res)=>{
	const sql = "DELETE FROM todo WHERE id = ?";
	pool.query(sql,[req.params.id],(err,result,fields) => {
		if (err) {
      console.error('psqlエラー(delete):', err);
      return res.status(500).json({ error: 'タスクの削除に失敗しました。' });
    }
		res.redirect('/');
	})
});

//更新アクション
app.post('/update/:id', (req, res) => {
  const sql = "UPDATE todo SET checked=? WHERE id = ?";
  pool.query(sql,[req.body.checked, req.params.id],(err,results)=>{
    if (err) {
      console.error('psqlエラー(update):', err);
      return res.status(500).json({ error: 'タスクの更新に失敗しました。' });
    }
		res.redirect('/');
  })
});

// ローカルサーバーを起動
app.listen(8080, ()=> {
  console.log(`サーバーがポート8080でリッスン中です`);
});