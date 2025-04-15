function attachEventListeners(listItem) {
    listItem.querySelector('.complete').addEventListener('click', function() {
        listItem.classList.toggle('completed');
    });

    listItem.querySelector('.edit').addEventListener('click', function() {
        const currentText = listItem.querySelector('.task-text')?.textContent;
        if (!currentText) return;

        // 정규표현식으로 시간 정보 추출
        const timeMatch = currentText.match(/(AM|PM)\s(\d{1,2}):(\d{2})/);
        if (!timeMatch) return;

        const currentAmpm = timeMatch[1];
        const currentHour = timeMatch[2];
        const currentMinute = timeMatch[3];

        const currentTask = currentText.replace(`${currentAmpm} ${currentHour}:${currentMinute} - `, '').trim();

        const originalHTML = listItem.innerHTML;

        const originalValues = {
            ampm: currentAmpm,
            hour: currentHour,
            minute: currentMinute,
            task: currentTask
        };

        listItem.innerHTML = `
            <div class="input-section">
                <select class="edit-ampm">
                    <option value="AM" ${originalValues.ampm === 'AM' ? 'selected' : ''}>오전</option>
                    <option value="PM" ${originalValues.ampm === 'PM' ? 'selected' : ''}>오후</option>
                </select>
                <input type="number" class="edit-hour" min="1" max="12" value="${parseInt(originalValues.hour, 10) || 1}">
                <input type="number" class="edit-minute" min="0" max="59" value="${parseInt(originalValues.minute, 10) || 0}">
                <input type="text" class="edit-task" value="${originalValues.task}">
                <button class="save">저장</button>
                <button class="cancel">취소</button>
            </div>
        `;

        listItem.querySelector('.save').addEventListener('click', function() {
            const newAmpm = listItem.querySelector('.edit-ampm').value;
            const newHour = listItem.querySelector('.edit-hour').value.padStart(2, '0');
            const newMinute = listItem.querySelector('.edit-minute').value.padStart(2, '0');
            const newTask = listItem.querySelector('.edit-task').value;

            listItem.className = 'task-item';
            listItem.innerHTML = `
                <span class="task-text">${newAmpm} ${newHour}:${newMinute} - ${newTask}</span>
                <div class="button-container">
                    <button class="complete">완료</button>
                    <button class="edit">수정</button>
                    <button class="delete">삭제</button>
                </div>
            `;

            attachEventListeners(listItem);
        });

        listItem.querySelector('.cancel').addEventListener('click', function() {
            listItem.innerHTML = originalHTML;
            attachEventListeners(listItem);
        });
    });

    listItem.querySelector('.delete').addEventListener('click', function() {
        listItem.remove();
    });

    listItem.setAttribute('draggable', true);

    listItem.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', listItem.dataset.id);
        listItem.classList.add('dragging');
    });

    listItem.addEventListener('dragend', function() {
        listItem.classList.remove('dragging');
    });

    listItem.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    listItem.addEventListener('drop', function(e) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.querySelector(`[data-id='${draggedId}']`);
        const taskList = listItem.parentElement;

        if (draggedElement !== listItem) {
            taskList.insertBefore(draggedElement, listItem.nextSibling);
        }
    });
}

function updateDateWeather() {
    const dateWeatherElement = document.getElementById('dateWeather');
    if (!dateWeatherElement) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const date = today.getDate().toString().padStart(2, '0');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const day = dayNames[today.getDay()];

    dateWeatherElement.textContent = `${year}년 ${month}월 ${date}일 ${day}요일`;
}

document.addEventListener('DOMContentLoaded', function() {
    updateDateWeather();
});

document.getElementById('addButton').addEventListener('click', function() {
    const ampm = document.getElementById('ampmInput').value;
    const hour = document.getElementById('hourInput').value.padStart(2, '0');
    const minute = document.getElementById('minuteInput').value.padStart(2, '0');
    const task = document.getElementById('taskInput').value;

    if (task) {
        const taskList = document.getElementById('taskList');
        const listItem = document.createElement('li');
        listItem.dataset.id = Date.now();
        listItem.className = 'task-item';

        listItem.innerHTML = `
            <span class="task-text">${ampm} ${hour}:${minute} - ${task}</span>
            <div class="button-container">
                <button class="complete">완료</button>
                <button class="edit">수정</button>
                <button class="delete">삭제</button>
            </div>
        `;

        taskList.appendChild(listItem);
        attachEventListeners(listItem);

        document.getElementById('hourInput').value = '1';
        document.getElementById('minuteInput').value = '0';
        document.getElementById('taskInput').value = '';
    }
});
