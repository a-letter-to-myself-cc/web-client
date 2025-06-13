document.addEventListener("DOMContentLoaded", () => {
    const routineForm = document.querySelector("#routine-form-wrapper form");
    const specialForm = document.querySelector("#special-date-form");

    const accessToken = localStorage.getItem("access");

    // ✅ 루틴 목록 불러오기
    async function fetchRoutineList() {
        try {
            const res = await fetch("/api/routines/list/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`루틴 목록 요청 실패: ${res.status}\n${errText}`);
            }

            const routines = await res.json();
            renderRoutineList(routines);
        } catch (err) {
            console.error("❌ 루틴 목록 로딩 오류:", err);
        }
    }

    // ✅ 루틴 목록 렌더링
    function renderRoutineList(items) {
        const routineUl = document.querySelector("#routine-list");
        const specialUl = document.querySelector("#specialday-list");

        routineUl.innerHTML = "";
        specialUl.innerHTML = "";

        items.forEach(item => {
            const li = document.createElement("li");

            if (item.type === "special") {
                // 특별한 날
                li.textContent = `${item.name} - ${item.date}`;
                specialUl.appendChild(li);
            } else {
                // 일반 루틴
                const detail = item.day_of_week || item.day_of_month || "";
                li.textContent = `${item.title} (${item.routine_type}) - ${detail} ${item.time}`;
                routineUl.appendChild(li);
            }
        });
    }



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

            alert("루틴이 저장되었습니다!");
            routineForm.reset();         // 폼 초기화
            await fetchRoutineList();    // 새로고침 없이 목록 갱신
        } catch (err) {
            alert("루틴 저장 중 오류 발생");
            console.error(err);
        }
    });

    // 🎉 기념일 저장
    specialForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: specialForm.querySelector("[name='name']").value,
            date: specialForm.querySelector("[name='date']").value
        };

        try {
            const res = await fetch("/api/routines/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`서버 오류 (${res.status}): ${errText}`);
            }

            alert("기념일이 저장되었습니다!");
            specialForm.reset();         // 폼 초기화
            await fetchRoutineList();    // 목록 새로고침
        } catch (err) {
            alert("기념일 저장 중 오류 발생");
            console.error(err);
        }
    });

    // ✅ 초기 루틴 목록 불러오기
    fetchRoutineList();
});