
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

console.log("Bob Empire initialized");
console.log("Supabase URL:", SUPABASE_URL);

function login() {
  alert("Login function triggered.");
}
function signup() {
  alert("Signup function triggered.");
}
window.login = login;
window.signup = signup;
