document.addEventListener("DOMContentLoaded", () => {
    const routineForm = document.querySelector("#routine-form-wrapper form");
    const specialForm = document.querySelector("#special-date-form");

    // 공통 CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrfToken = getCookie("csrftoken");
    // 쿠키에서 access 꺼내고 없으면 localStorage로 fallback
    let token = getCookie("access") || localStorage.getItem("access");

    // 💌 루틴 저장
    routineForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("api/routines/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Authorization": `Bearer ${token}`
                },
                body: new FormData(routineForm)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`서버 오류 (${res.status}): ${errText}`);
            }

            const data = await res.json();
            alert("루틴이 저장되었습니다!");
            window.location.reload();
        } catch (err) {
            alert("루틴 저장 중 오류 발생");
            console.error(err);
        }
    });

    // 🎉 기념일 저장
    specialForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        fetch("api/routines/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
                "Authorization": `Bearer ${token}`
            },
            body: new FormData(specialForm)
        })
        .then(res => res.json())
        .then(data => {
            alert("기념일이 저장되었습니다!");
            window.location.reload();
        })
        .catch(err => {
            alert("기념일 저장 중 오류 발생");
            console.error(err);
        });
    });
});

