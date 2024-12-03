const user_id = localStorage.getItem('user_id');
if(!user_id) {
    location.href = '/login';
}

export { user_id };