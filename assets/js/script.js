var tasks = {};
var pep = [
    {
        quote: '"Someday is not a day of the week."',
        quoteBy: 'Denise Brennan-Nelson'
    },
    {
        quote: '"If you cannot do great things, do small things in a great way."',
        quoteBy: 'Napoleon Hill'
    },
    {
        quote: '"Beware of monotony; it is the mother of all the deadly sins."',
        quoteBy: 'Edith Wharton'
    },
    {
        quote: '"Without hustle, talent will only carry you so far."',
        quoteBy: 'Gary Vaynerchuk'
    },
    {
        quote: '"I\'d rather regret the things I\'ve done than regret the things I haven\'t done."',
        quoteBy: 'Lucille Ball'
    },
    {
        quote: '"I didn\'t get there by wishing for it or hoping for it, but by working for it."',
        quoteBy: 'Estée Lauder'
    },
    {
        quote: '"Always do your best. What you plant now, you will harvest later."',
        quoteBy: 'Og Mandino'
    },
    {
        quote: '"The key to life is accepting challenges. Once someone stops doing this, he\'s dead."',
        quoteBy: 'Bette Davis'
    },
    {
        quote: '"Don\'t let the fear of losing be greater than the excitement of winning."',
        quoteBy: 'Robert Kiyosaki'
    },
    {
        quote: '"How dare you settle for less when the world has made it so easy for you to be remarkable?"',
        quoteBy: 'Seth Godin'
    },
    {
        quote: '"Energy and persistence conquer all things."',
        quoteBy: 'Benjamin Franklin'
    },
    {
        quote: '"Failure after long perseverance is much grander than never to have a striving good enough to be called a failure."',
        quoteBy: 'George Eliot'
    },
    {
        quote: '"The secret of joy in work is contained in one word -- excellence. To know how to do something well is to enjoy it."',
        quoteBy: 'Pearl Buck'
    },
    {
        quote: '"Action is the foundational key to all success."',
        quoteBy: 'Pablo Picasso'
    },
    {
        quote: '"Formula for success: rise early, work hard, strike oil."',
        quoteBy: 'J. Paul Getty'
    },
    {
        quote: '"The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will."',
        quoteBy: 'Vince Lombardi'
    },
    {
        quote: '"Determine that the thing can and shall be done, and then we shall find the way."',
        quoteBy: 'Abraham Lincoln'
    },
    {
        quote: '“I always wanted to be somebody, but now I realize I should have been more specific."',
        quoteBy: 'Lily Tomlin'
    },
    {
        quote: '"Done is better than perfect."',
        quoteBy: 'Sheryl Sandberg'
    },
    {
        quote: '"Here is a test to find whether your mission on Earth is finished – If you’re alive, it isn’t."',
        quoteBy: 'Richard Bach'
    },
    {
        quote: '"Don\'t ask if your dream is crazy, ask if it\'s crazy enough."',
        quoteBy: 'Lena Waithe'
    }
];

// create a task
function createTask(taskText, taskDate, taskList) {
    var taskLi = $('<li>').addClass('list-group-item');
    var taskSpan = $('<span>').addClass('badge badge-primary badge-pill').text(taskDate);
    var taskP = $('<p>').addClass('m-1').text(taskText);

    taskLi.append(taskSpan, taskP);

    checkTaskDue(taskLi);

    $('#list-' + taskList).append(taskLi);
};

// check task due date
function checkTaskDue(taskEl) {
    // get element date
    var date = $(taskEl).find('span').text().trim();

    // moment object--set due date at 5pm
    var time = moment(date, 'L').set('hour', 17);

    // change task class if task is near due or past due
    if (moment().isAfter(time)) {
        $(taskEl).addClass('list-group-item-danger').removeClass('list-group-item-warning');
    } else if (Math.abs(moment().diff(time, 'days')) <=1) {
        $(taskEl).addClass('list-group-item-warning').removeClass('list-group-item-danger');
    }
}

// add task button--trigger modal
$('#create-task').on('click', function() {
    $('#task-form-modal').modal('show');
    $('#modalTaskDescription, #modalDueDate').val('');

    // focus on task description input
    $('#task-form-modal').on('shown.bs.modal', function() {
        $('#modalTaskDescription').focus();
    });
});

// pep talk button--trigger modal
$('#pep-talk').on('click', function() {
    let randomQuote = pep[Math.floor(Math.random() * pep.length)];
    let quote = randomQuote.quote;
    let quoteBy = randomQuote.quoteBy;
    $('#quote-modal').modal('show');
    $('#quoteP').text(quote);
    $('#quoteByP').text(quoteBy);
});

// motivation boost button--trigger audio player
$('#motivation-boost').on('click', function() {
    $('#player').addClass('d-flex mw-25').removeClass('d-none');
    audio.play();
});

// modal save task button event listener
$('.btn-save').click(function() {
    var taskText = $('#modalTaskDescription').val();
    var taskDate = $('#modalDueDate').val();

    if (taskText && taskDate) {
        // create task
        createTask(taskText, taskDate, 'toDo');

        // close the modal
        $('#task-form-modal').modal('hide');

        // push task to tasks array
        tasks.toDo.push({
            text: taskText,
            date: taskDate
        });

        // save the task
        saveTasks();
        console.log(tasks);
    }
});

// taskDate field calendar
$('#modalDueDate').datepicker({
    minDate: 1
});

// edit existing task--description
$('.list-group').on('click', 'p', function() {
    var text = $(this).text().trim();

    // open text input field
    var textField = $('<textarea>').addClass('form-control').val(text);
    $(this).replaceWith(textField);
    textField.focus();
});

// edit task description field unfocus
$('.list-group').on('blur', 'textarea', function() {
    var text = $(this).val();

    var status = $(this).closest('.list-group').attr('id').replace('list-', '');

    var index = $(this).closest('.list-group-item').index();

    // update the task in tasks array
    tasks[status][index].text = text;
    saveTasks();

    // update list content
    var taskP = $('<p>').addClass('m-1').text(text);
    $(this).replaceWith(taskP);
});

// edit existing task--due date
$('.list-group').on('click', 'span', function() {
    var date = $(this).text().trim();

    var dateInput = $('<input>').attr('type', 'text').addClass('form-control').val(date);
    $(this).replaceWith(dateInput);

    dateInput.datepicker({
        minDate: 1,
        onClose: function() {
            $(this).trigger('change');
        }
    });

    dateInput.trigger('focus');
});

// due date update change event
$('.list-group').on('change', "input[type='text']", function() {
    var date = $(this).val();
    var status = $(this).closest('.list-group').attr('id').replace('list-', '');
    var index = $(this).closest('.list-group').index();

    // update the task in tasks array
    tasks[status][index].date = date;
    saveTasks();

    // update list content
    var taskSpan = $('<span>').addClass('badge badge-primary badge-pill').text(date);
    $(this).replaceWith(taskSpan);

    // check new task due date
    checkTaskDue($(taskSpan).closest('.list-group-item'));
});

// clear all tasks
$('#clear-tasks').on('click', function() {
    console.log(tasks);
    tasks = {};
    $('#list-toDo').empty();
    $('#list-inProgress').empty();
    $('#list-inReview').empty();
    $('#list-done').empty();
    console.log(tasks);

    saveTasks();
});

// list items are draggable between lists
$('.card .list-group').sortable({
    connectWith: $('.card .list-group'),
    scroll: false,
    tolerance: 'pointer',
    helper: 'clone',
    activate: function(event, ui) {
        $(this).addClass('dropover');
        $('.trash').addClass('trash-drag');
    },
    deactivate: function(event, ui) {
        $(this).removeClass('dropover');
        $('.trash').removeClass('trash-drag');
    },
    over: function(event) {
        $(event.target).addClass('dropover-active');
    },
    out: function(event) {
        $(event.target).removeClass('dropover-active');
    },
    update: function() {
        var tempArr = [];

        $(this).children().each(function() {
            tempArr.push({
                text: $(this).find('p').text().trim(),
                date: $(this).find('span').text().trim()
            })
        });

        var arrName = $(this).attr('id').replace('list-', '');

        tasks[arrName] = tempArr;
        saveTasks();
    }
});

// list items can be dragged and dropped in the trash
$('#trash').droppable({
    accept: '.card .list-group-item',
    tolerance: 'touch',
    drop: function(event, ui) {
        ui.draggable.remove();
        $('.trash').addClass('trash-active');
    },
    over: function(event, ui) {
        $('.trash').addClass('trash-active');
        $('#trash1').addClass('ri-eye-close-line').removeClass('ri-eye-2-line');
        $('#trash2').addClass('ri-eye-2-line').removeClass('ri-eye-close-line');
    },
    out: function(event, ui) {
        $('.trash').removeClass('trash-active');
        $('#trash1').addClass('ri-eye-2-line').removeClass('ri-eye-close-line');
        $('#trash2').addClass('ri-eye-close-line').removeClass('ri-eye-2-line');
    }
});

// load tasks from local storage
function loadTasks() {
tasks = JSON.parse(localStorage.getItem('tasks'));

    if (!tasks) {
        tasks = {
            toDo: [],
            inProgress: [],
            inReview: [],
            done: []
        };
    }

    $.each(tasks, function(list, arr) {
        arr.forEach(function(task) {
            createTask(task.text, task.date, list);
        });
    });
};

// save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// loadTasks call
loadTasks();

// set interval for taskStatus (every ten minutes)
setInterval(function() {
    $('list-group-item').each(function() {
        checkTaskDue($(this));
    });
}, 600000);