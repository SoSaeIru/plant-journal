// index.html에 쓰인 Tailwind 클래스만 골라 styles.css를 만든다 (npm run build)
module.exports = {
  content: ['./index.html'],
  theme: { extend: {} },
  plugins: [],
};
