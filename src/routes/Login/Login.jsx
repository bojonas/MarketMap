export default function Login() {
  return (
    <div className='bg-slate-700 flex items-center justify-center h-full'>
      <div className='bg-slate-700 rounded-lg p-8'>
        <div className='bg-slate-700 flex flex-col items-center justify-center'>
          <input id="login_username" type="text" placeholder="Username" className="custom-input mb-4" />
          <input id="login_password" type="password" placeholder="Password" className="custom-input mb-8" />
          <button className="custom-button" onClick={login_button}>Login</button>
          <p id="reset_pw" onclick={forgot_password}>Forgot Password?</p>
          <p id = "error_box" className="text-red-700 invisible"></p>
        </div>
      </div>
    </div>
  );
}

function login_button(){
  //todo: DB logik
  var pw = "1234"

  const username = document.getElementById("login_username").value
  const password = document.getElementById("login_password").value

  if(pw === password){
    //Log User in
  }
  else{
    document.getElementById("error_box").style.visibility = 'visible'
    document.getElementById("error_box").innerText = username+" "+password
  }
}

function forgot_password(){

  
}