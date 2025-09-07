// Course data and filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Course data array - modify the completed property based on your actual progress
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming concepts including loops, functions, and variables.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development.',
            technology: ['HTML', 'CSS'],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful programmers by learning to research and call functions written by others.',
            technology: ['Python'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: true
        },
        {
            subject: 'WDD',
            number: 230,
            title: 'Web Frontend Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects.',
            technology: ['C#'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'Students will learn to create engaging, interactive web pages.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 330,
            title: 'Web Frontend Development II',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'Students will learn to use JavaScript to create dynamic web pages.',
            technology: ['HTML', 'CSS', 'JavaScript'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 331,
            title: 'Frontend Web Development II',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'Students will learn advanced JavaScript and modern web development.',
            technology: ['HTML', 'CSS', 'JavaScript', 'React'],
            completed: false
        },
        {
            subject: 'WDD',
            number: 430,
            title: 'Web Backend Development',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'Students will learn to use Node.js to create server-side applications.',
            technology: ['Node.js', 'MongoDB'],
            completed: false
        }
    ];

    // Get DOM elements
    const coursesContainer = document.getElementById('courses-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalCreditsElement = document.getElementById('total-credits');
    
    let currentFilter = 'all';

    // Function to render courses
    function renderCourses(coursesToRender) {
        if (!coursesContainer) return;
        
        coursesContainer.innerHTML = '';
        
        coursesToRender.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;
            
            courseCard.innerHTML = `
                <h3>${course.subject} ${course.number}</h3>
                <p><strong>${course.title}</strong></p>
                <p>${course.description}</p>
                <p><strong>Technologies:</strong> ${course.technology.join(', ')}</p>
                <p class="course-credits"><strong>Credits:</strong> ${course.credits}</p>
                ${course.completed ? '<p class="completion-status">✓ Completed</p>' : '<p class="completion-status">⏳ In Progress</p>'}
            `;
            
            coursesContainer.appendChild(courseCard);
        });
        
        // Update total credits
        updateTotalCredits(coursesToRender);
    }

    // Function to update total credits
    function updateTotalCredits(coursesToShow) {
        if (!totalCreditsElement) return;
        
        const totalCredits = coursesToShow.reduce((total, course) => total + course.credits, 0);
        totalCreditsElement.textContent = totalCredits;
    }

    // Function to filter courses
    function filterCourses(filter) {
        let filteredCourses;
        
        switch(filter) {
            case 'WDD':
                filteredCourses = courses.filter(course => course.subject === 'WDD');
                break;
            case 'CSE':
                filteredCourses = courses.filter(course => course.subject === 'CSE');
                break;
            case 'all':
            default:
                filteredCourses = courses;
                break;
        }
        
        renderCourses(filteredCourses);
    }

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            // Filter and render courses
            filterCourses(filter);
        });
    });

    // Initial render - show all courses
    renderCourses(courses);
});
