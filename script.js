// Landmark & Location Nodes Database
const landmarks = [
    {
        id: 'gate_main',
        name: 'Main Campus Entrance',
        category: 'Gates',
        x: 120, y: 100,
        code: 'GATE-01',
        desc: 'Primary university access gate. Visitor registration and bus drop-off point.',
        photo: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80',
        amenities: ['Bus Stop', 'Security Desk', 'Information Kiosk']
    },
    {
        id: 'lib_central',
        name: 'Central University Library',
        category: 'Academic',
        x: 300, y: 220,
        code: 'LIB-101',
        desc: '4-story academic resource hub with 24/7 quiet study zones, Wi-Fi, and print center.',
        photo: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
        amenities: ['High-Speed Wi-Fi', 'Restrooms', 'Elevator', 'Quiet Study']
    },
    {
        id: 'eng_block',
        name: 'Engineering & Tech Block',
        category: 'Academic',
        x: 500, y: 220,
        code: 'ENG-200',
        desc: 'Houses Computer Science, Electrical, and Robotics research laboratories.',
        photo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
        amenities: ['Computer Labs', 'Elevator', 'Restrooms', 'Water Fountain']
    },
    {
        id: 'student_center',
        name: 'Student Center & Cafeteria',
        category: 'Dining',
        x: 300, y: 350,
        code: 'SC-100',
        desc: 'Central social hub offering multi-cuisine food courts, student lounge, and ATM.',
        photo: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=600&q=80',
        amenities: ['Cafeteria', 'ATM', 'Wi-Fi', 'Lounge']
    },
    {
        id: 'sports_complex',
        name: 'Sports Complex & Arena',
        category: 'Sports',
        x: 700, y: 350,
        code: 'SP-300',
        desc: 'Indoor basketball court, gymnasium, Olympic swimming pool, and running track.',
        photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
        amenities: ['Gym', 'Locker Rooms', 'First Aid', 'Restrooms']
    },
    {
        id: 'hostel_north',
        name: 'North Fresher Hostels',
        category: 'Hostels',
        x: 700, y: 100,
        code: 'HST-N',
        desc: 'Residential halls for 1st year students with dining hall and laundry.',
        photo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
        amenities: ['Laundry', 'Dining Hall', '24/7 Warden', 'Wi-Fi']
    },
    {
        id: 'admin_building',
        name: 'Administration & Dean Office',
        category: 'Services',
        x: 500, y: 500,
        code: 'ADM-01',
        desc: 'Student admissions, fee payments, registrar, and international student office.',
        photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        amenities: ['Fee Counter', 'Help Desk', 'Restrooms']
    },
    {
        id: 'gate_south',
        name: 'South Gate & Bus Stop',
        category: 'Gates',
        x: 880, y: 620,
        code: 'GATE-02',
        desc: 'Secondary exit connecting to metro line and local shuttle buses.',
        photo: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80',
        amenities: ['Bus Stop', 'Security Desk']
    }
];

// Presets for quick selection
const presets = [
    { label: 'Main Gate', id: 'gate_main' },
    { label: 'Library', id: 'lib_central' },
    { label: 'Cafeteria', id: 'student_center' },
    { label: 'Hostels', id: 'hostel_north' }
];

// Filter Categories
const categories = ['All', 'Academic', 'Hostels', 'Dining', 'Sports', 'Services', 'Gates'];
let activeCategory = 'All';

// Current navigation state
let currentStart = 'gate_main';
let currentEnd = 'student_center';
let currentStepIndex = 0;
let generatedSteps = [];
let zoomLevel = 1;

// Initialize application on load
window.onload = function() {
    populateDropdowns();
    renderPresets();
    renderFilterTags();
    renderLandmarkCards();
    renderMapNodes();
    calculateAndDrawRoute();
};

// Populate Start and End Dropdowns
function populateDropdowns() {
    const startSelect = document.getElementById('startSelect');
    const endSelect = document.getElementById('endSelect');

    startSelect.innerHTML = '';
    endSelect.innerHTML = '';

    landmarks.forEach(lm => {
        const opt1 = document.createElement('option');
        opt1.value = lm.id;
        opt1.textContent = `${lm.name} (${lm.code})`;
        startSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = lm.id;
        opt2.textContent = `${lm.name} (${lm.code})`;
        endSelect.appendChild(opt2);
    });

    startSelect.value = currentStart;
    endSelect.value = currentEnd;
}

// Render Quick Presets
function renderPresets() {
    const container = document.getElementById('presetButtons');
    container.innerHTML = '';
    presets.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs text-slate-600 hover:text-indigo-600 rounded-lg transition font-medium';
        btn.textContent = p.label;
        btn.onclick = () => {
            document.getElementById('startSelect').value = p.id;
            calculateAndDrawRoute();
        };
        container.appendChild(btn);
    });
}

// Render Category Filter Tags
function renderFilterTags() {
    const container = document.getElementById('filterTags');
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        const isActive = cat === activeCategory;
        btn.className = `px-3 py-1 rounded-full text-xs font-semibold transition ${
            isActive 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`;
        btn.textContent = cat;
        btn.onclick = () => {
            activeCategory = cat;
            renderFilterTags();
            renderLandmarkCards();
        };
        container.appendChild(btn);
    });
}

// Render List of Landmarks in Sidebar
function renderLandmarkCards() {
    const container = document.getElementById('landmarksTab');
    const filtered = activeCategory === 'All' 
        ? landmarks 
        : landmarks.filter(l => l.category === activeCategory);

    document.getElementById('landmarkCount').textContent = filtered.length;
    container.innerHTML = '';

    filtered.forEach(lm => {
        const card = document.createElement('div');
        card.className = 'p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group';
        card.onclick = () => openLandmarkModal(lm.id);

        card.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <div>
                    <h4 class="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition">${lm.name}</h4>
                    <span class="text-xs text-slate-400 font-medium">${lm.code} • ${lm.category}</span>
                </div>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-500 transition"></i>
        `;
        container.appendChild(card);
    });
}

// Render Map Landmark Nodes
function renderMapNodes() {
    const layer = document.getElementById('landmarksLayer');
    layer.innerHTML = '';

    landmarks.forEach(lm => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'cursor-pointer');
        g.onclick = () => openLandmarkModal(lm.id);

        const isStart = lm.id === document.getElementById('startSelect').value;
        const isEnd = lm.id === document.getElementById('endSelect').value;

        let color = '#6366f1';
        if (isStart) color = '#10b981';
        if (isEnd) color = '#ef4444';

        // Outer circle pin
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', lm.x);
        circle.setAttribute('cy', lm.y);
        circle.setAttribute('r', isStart || isEnd ? '12' : '9');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '2.5');

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', lm.x);
        text.setAttribute('y', lm.y + 24);
        text.setAttribute('fill', '#f8fafc');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '600');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = lm.name;

        g.appendChild(circle);
        g.appendChild(text);
        layer.appendChild(g);
    });
}

// Calculate Distance & Dynamic Route Path Drawing
function calculateAndDrawRoute() {
    const startId = document.getElementById('startSelect').value;
    const endId = document.getElementById('endSelect').value;

    currentStart = startId;
    currentEnd = endId;

    const startNode = landmarks.find(l => l.id === startId);
    const endNode = landmarks.find(l => l.id === endId);

    renderMapNodes();

    if (!startNode || !endNode || startId === endId) {
        document.getElementById('routePath').setAttribute('d', '');
        document.getElementById('routeDistance').textContent = '0 m';
        document.getElementById('routeTime').textContent = '(0 mins)';
        document.getElementById('stepsList').innerHTML = '<p class="text-xs text-slate-400 p-2">Select different locations to view route directions.</p>';
        document.getElementById('mobileStepText').textContent = 'Please select Start and Destination.';
        return;
    }

    // Pathfinding points (Intermediate waypoints aligned with pathways)
    const pathData = `M ${startNode.x} ${startNode.y} L ${startNode.x} ${endNode.y} L ${endNode.x} ${endNode.y}`;
    
    document.getElementById('routePath').setAttribute('d', pathData);

    // Distance calculation
    const dx = Math.abs(startNode.x - endNode.x);
    const dy = Math.abs(startNode.y - endNode.y);
    const distanceMeters = Math.round((dx + dy) * 1.5); // Approx scaling
    const timeMins = Math.max(1, Math.round(distanceMeters / 70)); // ~70m per min walk

    document.getElementById('routeDistance').textContent = `${distanceMeters} m`;
    document.getElementById('routeTime').textContent = `(~${timeMins} mins walk)`;

    // Generate Steps
    generateStepByStepInstructions(startNode, endNode, distanceMeters);
}

// Generate Turn-by-Turn Text Instructions
function generateStepByStepInstructions(start, end, totalDist) {
    generatedSteps = [
        {
            icon: 'fa-circle-dot text-emerald-500',
            title: `Start at ${start.name}`,
            sub: `Exit ${start.code} towards main pathway. (Outdoor Pathway)`
        },
        {
            icon: 'fa-person-walking text-indigo-500',
            title: `Walk straight for approx ${Math.round(totalDist * 0.5)} meters`,
            sub: `Follow paved walkway past central lawns.`
        },
        {
            icon: 'fa-arrow-turn-right text-indigo-500',
            title: `Turn Right at Main Avenue`,
            sub: `Pass security desk & outdoor signage board.`
        },
        {
            icon: 'fa-location-dot text-red-500',
            title: `Arrive at ${end.name}`,
            sub: `Destination is on your right. Building Code: ${end.code}`
        }
    ];

    currentStepIndex = 0;
    renderStepsList();
    updateMobileStepBar();
}

// Render Steps List in Directions Tab
function renderStepsList() {
    const container = document.getElementById('stepsList');
    container.innerHTML = '';

    generatedSteps.forEach((step, index) => {
        const isCurrent = index === currentStepIndex;
        const div = document.createElement('div');
        div.className = `relative pl-8 transition ${isCurrent ? 'opacity-100 font-semibold' : 'opacity-70'}`;
        
        div.innerHTML = `
            <div class="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs shadow-sm">
                <i class="fa-solid ${step.icon}"></i>
            </div>
            <div>
                <h5 class="text-xs text-slate-800">${step.title}</h5>
                <p class="text-[11px] text-slate-500 font-normal">${step.sub}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

// Navigation between steps on mobile bar
function navigateStep(direction) {
    if (generatedSteps.length === 0) return;
    currentStepIndex = Math.max(0, Math.min(generatedSteps.length - 1, currentStepIndex + direction));
    renderStepsList();
    updateMobileStepBar();
}

function updateMobileStepBar() {
    if (generatedSteps.length === 0) return;
    document.getElementById('mobileStepProgress').textContent = `Step ${currentStepIndex + 1} of ${generatedSteps.length}`;
    document.getElementById('mobileStepText').textContent = generatedSteps[currentStepIndex].title;
}

// Swap Start and Destination
function swapLocations() {
    const startSelect = document.getElementById('startSelect');
    const endSelect = document.getElementById('endSelect');
    
    const temp = startSelect.value;
    startSelect.value = endSelect.value;
    endSelect.value = temp;

    calculateAndDrawRoute();
}

// Sidebar Tab Switching
function switchSidebarTab(tab) {
    const landmarksTab = document.getElementById('landmarksTab');
    const directionsTab = document.getElementById('directionsTab');
    const tabLandmarksBtn = document.getElementById('tabLandmarksBtn');
    const tabDirectionsBtn = document.getElementById('tabDirectionsBtn');

    if (tab === 'landmarks') {
        landmarksTab.classList.remove('hidden');
        directionsTab.classList.add('hidden');
        tabLandmarksBtn.className = 'flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-600 transition';
        tabDirectionsBtn.className = 'flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition';
    } else {
        landmarksTab.classList.add('hidden');
        directionsTab.classList.remove('hidden');
        tabDirectionsBtn.className = 'flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-600 transition';
        tabLandmarksBtn.className = 'flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition';
    }
}

// Landmark Detail Modal Operations
function openLandmarkModal(id) {
    const lm = landmarks.find(l => l.id === id);
    if (!lm) return;

    document.getElementById('modalImage').src = lm.photo;
    document.getElementById('modalTitle').textContent = lm.name;
    document.getElementById('modalBuildingCode').textContent = `${lm.code} • ${lm.category}`;
    document.getElementById('modalCategoryTag').textContent = lm.category;
    document.getElementById('modalDescription').textContent = lm.desc;

    // Amenities Tags
    const amContainer = document.getElementById('modalAmenities');
    amContainer.innerHTML = '';
    lm.amenities.forEach(a => {
        const tag = document.createElement('span');
        tag.className = 'px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium';
        tag.textContent = a;
        amContainer.appendChild(tag);
    });

    // Button actions
    document.getElementById('modalSetStartBtn').onclick = () => {
        document.getElementById('startSelect').value = lm.id;
        calculateAndDrawRoute();
        closeLandmarkModal();
        switchSidebarTab('directions');
    };

    document.getElementById('modalSetEndBtn').onclick = () => {
        document.getElementById('endSelect').value = lm.id;
        calculateAndDrawRoute();
        closeLandmarkModal();
        switchSidebarTab('directions');
    };

    const modal = document.getElementById('landmarkModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeLandmarkModal() {
    const modal = document.getElementById('landmarkModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

// Emergency Modal Toggle
function toggleEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    modal.classList.toggle('opacity-0');
    modal.classList.toggle('pointer-events-none');
}

// Mobile Sheet Toggle
function toggleMobileSearchSheet() {
    const sheet = document.getElementById('searchSidebar');
    sheet.classList.toggle('-translate-x-full');
}

// Map Zoom functionality
function zoomMap(factor) {
    zoomLevel *= factor;
    zoomLevel = Math.max(0.7, Math.min(2.5, zoomLevel));
    const svg = document.getElementById('campusMapSvg');
    svg.style.transform = `scale(${zoomLevel})`;
}

function resetMapView() {
    zoomLevel = 1;
    const svg = document.getElementById('campusMapSvg');
    svg.style.transform = 'scale(1)';
}