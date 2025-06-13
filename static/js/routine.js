document.addEventListener("DOMContentLoaded", () => {
    const routineForm = document.querySelector("#routine-form-wrapper form");
    const specialForm = document.querySelector("#special-date-form");

    // // 공통 CSRF
    // function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }

    const accessToken = localStorage.getItem("access");

    // //Django CSRF 보호를 통과하려면 필요
    // const csrfToken = getCookie("csrftoken");

    // 💌 루틴 저장
    routineForm?.addEventListener("submit", async (e) => {
    e.preventDefault();


    // ✅ 여기서 form 데이터 수집해서 payload 생성해야 함
    const payload = {
        title: routineForm.querySelector("[name='title']").value,
        routine_type: routineForm.querySelector("[name='routine_type']").value,
        day_of_week: routineForm.querySelector("[name='day_of_week']").value || null,
        day_of_month: routineForm.querySelector("[name='day_of_month']").value || null,
        routine_time: routineForm.querySelector("[name='routine_time']").value,
    };
        try {
            const res = await fetch("/api/routines/", {
                method: "POST",
                headers: {
                    //"X-CSRFToken": csrfToken,
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload)
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

        const payload = {
            name: specialForm.querySelector("[name='name']").value,
            date: specialForm.querySelector("[name='date']").value
        };
                 
        fetch("/api/routines/", {
            method: "POST",
            headers: {
                //"X-CSRFToken": csrfToken,
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload)
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

