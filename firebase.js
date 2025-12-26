// firebase.js — compatível com Firebase v8 (modo correto para GitHub Pages)

const firebaseConfig = {
    apiKey: "AIzaSyCU6zc6nJaJzxsPrZZXHroD7X7IEutQcIQ",
    authDomain: "bingool-3b42f.firebaseapp.com",
    databaseURL: "https://bingool-3b42f-default-rtdb.firebaseio.com",
    projectId: "bingool-3b42f",
    storageBucket: "bingool-3b42f.firebasestorage.app",
    messagingSenderId: "478190203456",
    appId: "1:478190203456:web:52f4385b8c6e5726d025a5"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();