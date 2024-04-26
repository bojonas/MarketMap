export default function Login({ width, height }) {
  return (
    <div className='bg-slate-700 flex items-center justify-center h-full'>
      <div className='bg-slate-700 rounded-lg p-8'>
        <div className='bg-slate-700 flex flex-col items-center justify-center'>
          <input id="login_username" type="text" placeholder="Username" className="custom-input mb-4" />
          <input type="password" placeholder="Password" className="custom-input mb-8" />
          <button className="custom-button" onClick={login_button()}>Login</button>
          <p className="text-red-700" hidden>invalid password</p>
        </div>
      </div>
    </div>
  );
}

function login_button(){
console.log("Hallo")
}