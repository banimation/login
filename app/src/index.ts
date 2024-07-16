const uid = (document.getElementById("uid") as HTMLInputElement).value
const password = (document.getElementById("password") as HTMLInputElement).value

const signIn = document.getElementById("sign-in") as HTMLElement

signIn.addEventListener("click", () => {
    const data = {uid: uid, password: password}
    fetch("/sign-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then((res) => {
        if(res.msg === "succeed") {
            location.reload()
        } else if(res.msg === "wrongPassword") {
            alert("잘못된 비밀번호")
        } else if(res.msg === "noExist") {
            alert("존재하지 않는 계정 입니다.")
        }
    })
})