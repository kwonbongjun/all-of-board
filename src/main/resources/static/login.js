alert('0');
import axios from "axios";
document.getElementById("myform").addEventListener("submit", function(event){
  event.preventDefault();
  axios.post('http://localhost:8080/login', {
      username: 'test',
      password: '1234'
  }).then(res => console.log('1',res));
});

async function doLogin() {
  console.log(event);
  event.preventDefault();
  axios.post('http://localhost:8080/login', {
      username: this.state.id,
      password: this.state.password
  }).then(res => console.log('1',res));
  return false;
}