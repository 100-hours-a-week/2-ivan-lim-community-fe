async function duplicateNicknameChk(nickname) {
    const response = await fetch(`http://localhost:3030/api/users/nickname?nickname=${nickname}`);
    try{
        if(response.ok)
        {
            const responseData = await response.json();
            const data = responseData.data;
            if(data.duplication)
                return true;
            return false;
        }
    }catch(e){
        console.error(e);
    }
}

async function duplicateEmailChk(email) {
    const response = await fetch("http://localhost:3030/api/users/email?email=" + email);
    try{
        if(response.ok)
        {
            const responseData = await response.json();
            const data = responseData.data;
            if(data.duplication)
                return true;
            return false;
        }
    }catch(e){
        console.error(e);
    }
}

export { duplicateNicknameChk, duplicateEmailChk };