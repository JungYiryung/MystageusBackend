const maria = require('mariadb');

const pool = maria.createPool({ // express 입잗ㅇ에서 db로그인 하는것
    host: "localhost", //localhost => 같은 아이피라는 뜻.  
    // 서버 옮겼을때 수정해줘야하기때문에 / 웹서버와 db서버가 분리되어있을때 이렇게 명시적으로 적어줘야한다. 
    port: "3306",
    user: "stageus",
    password: "1234",
    database: "week14HW",
    connectionLimit : 5
});

module.exports = pool;