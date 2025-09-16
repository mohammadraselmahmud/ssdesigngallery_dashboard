export default function formatMoney(money) {
  if (money >= 1e9) {
    return (money / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (money >= 1e6) {
    return (money / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (money >= 1e3) {
    return (money / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return money.toString();
}
