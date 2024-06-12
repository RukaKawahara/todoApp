const express = require('express');
const mysql = require('mysql');
const app = express();

// HTMLファイルをホストするディレクトリを指定する
app.use(express.static('public/'));

// フォームデータをパースするためのミドルウェア
app.use(express.urlencoded({extended:true}));

// ビューエンジンにejsをセットする
app.set("view engine","ejs");
app.engine('ejs', require('ejs').__express);

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

connection.connect((err) => {
  // MySQLへの接続ができていないときにエラーを表示
  if(err){
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM todo',
    (err, results) => {
      if(err){
        console.log('MySQLエラー(select):' + err.stack);
        return;
      }
      res.render('index.ejs',{todos:results});
    }
  );
});

app.post('/add', (req, res) => {
  const text = req.body.text;
  const insertQuery = 'INSERT INTO todo (text, checked) VALUES (?, ?)';
  connection.query(insertQuery, [text, false], (err, results) => {
    if (err) {
      console.error('MySQLエラー(insert):', err);
      return res.status(500).json({ error: 'タスクの追加に失敗しました。' });
    }
    res.redirect('/');
  });
});

app.post('/delete/:id',(req,res)=>{
	const sql = "DELETE FROM todo WHERE id = ?";
	connection.query(sql,[req.params.id],(err,result,fields) => {
		if (err) {
      console.error('MySQLエラー(delete):', err);
      return res.status(500).json({ error: 'タスクの削除に失敗しました。' });
    }
		res.redirect('/');
	})
});

//更新アクション
app.post('/update/:id', (req, res) => {
  const sql = "UPDATE todo SET checked=? WHERE id = ?";
  connection.query(sql,[req.body.checked, req.params.id],(err,results)=>{
    if (err) {
      console.error('MySQLエラー(update):', err);
      return res.status(500).json({ error: 'タスクの更新に失敗しました。' });
    }
		res.redirect('/');
  })
});

// ローカルサーバーを起動
app.listen(8080, ()=> {
  console.log(`サーバーがポート8080でリッスン中です`);
});