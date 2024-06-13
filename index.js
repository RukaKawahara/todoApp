const express = require('express');
const pg = require("pg");
const app = express();
const port = process.env.PORT || 8080;

require('dotenv').config();

// HTMLファイルをホストするディレクトリを指定する
app.use(express.static('public/'));

// フォームデータをパースするためのミドルウェア
app.use(express.urlencoded({extended:true}));

// ビューエンジンにejsをセットする
app.set("view engine","ejs");
app.engine('ejs', require('ejs').__express);

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  ssl: true,
};

var pool = new pg.Pool(config);
pool.connect();

app.get('/', async(req, res) => {
  const insertQuery = 'SELECT * FROM todo ORDER BY id';
  try {
    const result = await pool.query(insertQuery);
    res.render('index', {todos:result.rows});
  } catch(err) {
    console.error(err.stack)
  }
});

app.post('/add', async(req, res) => {
  const text = req.body.text;
  //INSERTクエリを作成する。※Value値は必ず「$1,$2,$3,...」とすること！(ほかの変数にすると構文エラーになる
  const insertQuery = 'INSERT INTO todo (text, checked) VALUES ($1, $2) RETURNING *';
  try {
    await pool.query(insertQuery, [text, false]);
    res.redirect('/');
  } catch(err) {
    console.error(err.stack)
  }
});


app.post('/delete/:id', async(req, res) => {
  const sql = "DELETE FROM todo WHERE id = $1 RETURNING *";
  try {
    await pool.query(sql,[req.params.id]);
    res.redirect('/');
  } catch(err) {
    console.error(err.stack)
  }
});

// checkboxの更新
app.post('/update/:id', async(req, res) => {
  const sql = "UPDATE todo SET checked=$1 WHERE id = $2 RETURNING *";
  try {
    await pool.query(sql,[req.body.checked, req.params.id]);
    res.redirect('/');
  } catch(err) {
    console.error(err.stack)
  }
});

// ローカルサーバーを起動
app.listen(port, ()=> {
  console.log(`サーバーがポート8080でリッスン中です`);
});