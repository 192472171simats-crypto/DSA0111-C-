/**
 * AutoCare 360 – Smart Vehicle Service and Maintenance Management System
 * Web Client Engine implementing full OOP Domain Models and Predictive AI Logic
 */

// ==========================================================================
// 1. OOP DOMAIN CLASSES (Mirrors C++ Backend Architecture)
// ==========================================================================

class Person {
    constructor(id, name, phone, email) {
        this._id = Number(id);
        this._name = String(name);
        this._phone = String(phone);
        this._email = String(email);
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get phone() { return this._phone; }
    get email() { return this._email; }
    set name(n) { if (n) this._name = n; }
    set phone(p) { if (p) this._phone = p; }
    set email(e) { if (e) this._email = e; }
}

class Customer extends Person {
    constructor(id, name, phone, email, address, vehicleIds = []) {
        super(id, name, phone, email);
        this._address = String(address);
        this._vehicleIds = Array.isArray(vehicleIds) ? vehicleIds.map(Number) : [];
    }
    get address() { return this._address; }
    set address(a) { if (a) this._address = a; }
    get vehicleIds() { return this._vehicleIds; }
    addVehicle(vId) {
        const id = Number(vId);
        if (!this._vehicleIds.includes(id)) this._vehicleIds.push(id);
    }
    removeVehicle(vId) {
        this._vehicleIds = this._vehicleIds.filter(id => id !== Number(vId));
    }
}

class Vehicle {
    constructor(id, regNum, type, brand, model, year, km, ownerId, lastServiceKm = 0, lastServiceDate = 'N/A') {
        this._id = Number(id);
        this._regNum = String(regNum);
        this._type = String(type);
        this._brand = String(brand);
        this._model = String(model);
        this._year = Number(year);
        this._km = Number(km);
        this._ownerId = Number(ownerId);
        this._lastServiceKm = Number(lastServiceKm);
        this._lastServiceDate = String(lastServiceDate);
    }
    get id() { return this._id; }
    get regNum() { return this._regNum; }
    get type() { return this._type; }
    get brand() { return this._brand; }
    get model() { return this._model; }
    get year() { return this._year; }
    get km() { return this._km; }
    get ownerId() { return this._ownerId; }
    get lastServiceKm() { return this._lastServiceKm; }
    get lastServiceDate() { return this._lastServiceDate; }

    set regNum(r) { if (r) this._regNum = r; }
    set type(t) { if (t) this._type = t; }
    set brand(b) { if (b) this._brand = b; }
    set model(m) { if (m) this._model = m; }
    set year(y) { if (y >= 1970) this._year = Number(y); }
    set km(k) { if (k >= 0) this._km = Number(k); }
    set ownerId(o) { this._ownerId = Number(o); }

    recordCompletedService(serviceKm, date) {
        this._lastServiceKm = Math.max(this._lastServiceKm, Number(serviceKm));
        this._lastServiceDate = String(date);
        this._km = Math.max(this._km, this._lastServiceKm);
    }
}

// Abstract Service Class Hierarchy
class Service {
    constructor(id, vehicleId, vehicleReg, date, baseCost, km, status = 'Completed', notes = '') {
        if (new.target === Service) {
            throw new TypeError("Cannot construct Abstract Service class directly.");
        }
        this._id = Number(id);
        this._vehicleId = Number(vehicleId);
        this._vehicleReg = String(vehicleReg);
        this._date = String(date);
        this._baseCost = Number(baseCost);
        this._km = Number(km);
        this._status = String(status);
        this._notes = String(notes);
    }
    get id() { return this._id; }
    get vehicleId() { return this._vehicleId; }
    get vehicleReg() { return this._vehicleReg; }
    get date() { return this._date; }
    get baseCost() { return this._baseCost; }
    get km() { return this._km; }
    get status() { return this._status; }
    get notes() { return this._notes; }

    calculateCost() { throw new Error("Method calculateCost() must be implemented."); }
    getServiceType() { throw new Error("Method getServiceType() must be implemented."); }
}

class BasicService extends Service {
    constructor(id, vehicleId, vehicleReg, date, baseCost, km, partsCost = 45.0, oilGrade = '5W-30 Standard', discount = 0.0, status = 'Completed', notes = '') {
        super(id, vehicleId, vehicleReg, date, baseCost, km, status, notes);
        this._partsCost = Number(partsCost);
        this._oilGrade = String(oilGrade);
        this._discount = Number(discount);
    }
    get partsCost() { return this._partsCost; }
    get oilGrade() { return this._oilGrade; }
    get discount() { return this._discount; }

    calculateCost() {
        return Math.max(0, (this._baseCost + this._partsCost) - this._discount);
    }
    getServiceType() { return 'Basic Service'; }
}

class PremiumService extends Service {
    constructor(id, vehicleId, vehicleReg, date, baseCost, km, inspectionFee = 75.0, synthOilCharge = 60.0, detailingCharge = 50.0, diagnosticScanFee = 40.0, status = 'Completed', notes = '') {
        super(id, vehicleId, vehicleReg, date, baseCost, km, status, notes);
        this._inspectionFee = Number(inspectionFee);
        this._synthOilCharge = Number(synthOilCharge);
        this._detailingCharge = Number(detailingCharge);
        this._diagnosticScanFee = Number(diagnosticScanFee);
    }
    get inspectionFee() { return this._inspectionFee; }
    get synthOilCharge() { return this._synthOilCharge; }
    get detailingCharge() { return this._detailingCharge; }
    get diagnosticScanFee() { return this._diagnosticScanFee; }

    calculateCost() {
        return this._baseCost + this._inspectionFee + this._synthOilCharge + this._detailingCharge + this._diagnosticScanFee;
    }
    getServiceType() { return 'Premium Service'; }
}

class EmergencyService extends Service {
    constructor(id, vehicleId, vehicleReg, date, baseCost, km, towingFee = 120.0, rapidDiag = 80.0, overtimeLabor = 95.0, roadside = true, status = 'Completed', notes = '') {
        super(id, vehicleId, vehicleReg, date, baseCost, km, status, notes);
        this._towingFee = Number(towingFee);
        this._rapidDiag = Number(rapidDiag);
        this._overtimeLabor = Number(overtimeLabor);
        this._roadside = Boolean(roadside);
    }
    get towingFee() { return this._towingFee; }
    get rapidDiag() { return this._rapidDiag; }
    get overtimeLabor() { return this._overtimeLabor; }
    get roadside() { return this._roadside; }

    calculateCost() {
        const dispatch = this._roadside ? 50.0 : 0.0;
        return this._baseCost + this._towingFee + this._rapidDiag + this._overtimeLabor + dispatch;
    }
    getServiceType() { return 'Emergency Service'; }
}

// ==========================================================================
// 2. SMART ALGORITHMS & PERSISTENCE ENGINE
// ==========================================================================

const MaintenancePlanner = {
    getInterval(vehicleType, maintenanceType) {
        let interval = 10000;
        if (maintenanceType === 'Oil Change') interval = (vehicleType === 'Electric') ? 20000 : 7500;
        else if (maintenanceType === 'Engine Service') interval = 25000;
        else if (maintenanceType === 'Brake Inspection') interval = 15000;
        else if (maintenanceType === 'Tire Replacement') interval = 20000;
        else if (maintenanceType === 'Battery Check') interval = (vehicleType === 'Electric') ? 15000 : 30000;
        else if (maintenanceType === 'General Service') interval = 12000;

        if (vehicleType === 'Truck') interval = Math.floor(interval * 0.85);
        return interval;
    },

    calculateNextService(currentKm, vehicleType, maintenanceType) {
        const interval = this.getInterval(vehicleType, maintenanceType);
        const rem = currentKm % interval;
        return rem === 0 ? currentKm + interval : currentKm + (interval - rem);
    },

    determinePriority(currentKm, lastServiceKm, maintenanceType, healthScore) {
        const interval = this.getInterval('Generic', maintenanceType);
        const kmDiff = Math.max(0, currentKm - lastServiceKm);
        const isCriticalType = (maintenanceType === 'Brake Inspection' || maintenanceType === 'Engine Service');

        if (kmDiff > interval + 2500 || healthScore < 40 || (isCriticalType && kmDiff > interval)) {
            return { level: 'CRITICAL', class: 'badge-crimson', advice: 'CRITICAL: Urgent mechanical inspection needed immediately.' };
        } else if (kmDiff >= interval || healthScore < 60) {
            return { level: 'HIGH', class: 'badge-amber', advice: 'HIGH: Schedule service within 1-2 weeks or prior to long travel.' };
        } else if (kmDiff >= interval - 1500 || healthScore < 80) {
            return { level: 'MEDIUM', class: 'badge-cyan', advice: 'MEDIUM: Service window approaching. Monitor fluid levels and tire wear.' };
        }
        return { level: 'LOW', class: 'badge-emerald', advice: 'LOW: Vehicle operating in optimal parameters. Routine check on schedule.' };
    },

    calculateEstimatedDate(currentKm, nextServiceKm, avgKmPerMonth = 1200) {
        const diff = nextServiceKm - currentKm;
        if (diff <= 0) return 'Immediate Service Required';
        const days = Math.round((diff / avgKmPerMonth) * 30.4);
        const target = new Date();
        target.setDate(target.getDate() + days);
        return target.toISOString().split('T')[0];
    },

    estimateCost(maintenanceType, vehicleType) {
        let base = 120.0;
        if (maintenanceType === 'Oil Change') base = 75.0;
        else if (maintenanceType === 'Engine Service') base = 350.0;
        else if (maintenanceType === 'Brake Inspection') base = 160.0;
        else if (maintenanceType === 'Tire Replacement') base = 280.0;
        else if (maintenanceType === 'Battery Check') base = 90.0;
        else if (maintenanceType === 'General Service') base = 210.0;

        if (vehicleType === 'SUV' || vehicleType === 'Truck') base *= 1.25;
        else if (vehicleType === 'Electric') base *= 1.15;
        return base;
    }
};

const HealthAnalyzer = {
    analyze(vehicle, services = []) {
        let score = 100;
        const km = vehicle.km;
        if (km > 20000) {
            score -= Math.min(25, Math.floor((km - 20000) / 5000));
        }
        const age = 2026 - vehicle.year;
        if (age > 3) {
            score -= Math.min(20, (age - 3) * 2);
        }
        const kmSinceService = vehicle.km - vehicle.lastServiceKm;
        if (kmSinceService > 15000) score -= 20;
        else if (kmSinceService > 10000) score -= 12;
        else if (kmSinceService > 7500) score -= 6;

        score += Math.min(10, services.length * 2);
        score = Math.max(10, Math.min(100, score));

        let status = 'Excellent';
        let statusClass = 'badge-emerald';
        let color = '#10B981';

        if (score < 40) { status = 'Critical'; statusClass = 'badge-crimson'; color = '#EF4444'; }
        else if (score < 60) { status = 'Needs Attention'; statusClass = 'badge-amber'; color = '#F59E0B'; }
        else if (score < 80) { status = 'Good'; statusClass = 'badge-cyan'; color = '#06B6D4'; }

        return {
            score,
            status,
            statusClass,
            color,
            engine: Math.min(100, Math.max(15, score + (kmSinceService < 5000 ? 5 : -4))),
            brake: Math.min(100, Math.max(15, score - (km > 40000 ? 8 : 0))),
            battery: Math.min(100, Math.max(15, score - (age * 3))),
            suspension: Math.min(100, Math.max(15, score - (km > 60000 ? 12 : 2)))
        };
    }
};

// ==========================================================================
// 3. APPLICATION STATE & PERSISTENCE
// ==========================================================================

const AppState = {
    customers: [],
    vehicles: [],
    services: [],
    isAuthenticated: false,
    currentUser: 'CAPSTONE',
    selectedVehicleId: 1001,
    selectedCustomerId: 101,
    activeTier: 'BASIC',
    activePlannerVehicleId: 1001,
    activePlannerCategory: 'Oil Change',
    activeReportType: 'financial',
    activeHistoryFilter: 'ALL',

    init() {
        const auth = sessionStorage.getItem('autocare_auth') || localStorage.getItem('autocare_auth');
        if (auth === 'CAPSTONE') {
            this.isAuthenticated = true;
            this.currentUser = 'CAPSTONE';
        }

        const loadedC = localStorage.getItem('autocare_customers');
        const loadedV = localStorage.getItem('autocare_vehicles');
        const loadedS = localStorage.getItem('autocare_services');

        if (loadedC && loadedV && loadedS) {
            this.loadFromJSON(JSON.parse(loadedC), JSON.parse(loadedV), JSON.parse(loadedS));
        } else {
            this.loadDefaultDataset();
            this.save();
        }
    },

    loadDefaultDataset() {
        this.customers = [
            new Customer(101, 'Alexander Wright', '+1 (555) 234-8890', 'alex.wright@autoclub.com', '742 Evergreen Terrace, Springfield', [1001, 1002]),
            new Customer(102, 'Elena Rostova', '+1 (555) 891-2244', 'elena.r@techcorp.io', '1204 Horizon Boulevard, Suite 5B, Metropolis', [1003]),
            new Customer(103, 'Marcus Vance', '+1 (555) 432-1100', 'm.vance@logistics.net', '88 Industrial Parkway, Bay City', [1004, 1005]),
            new Customer(104, 'Sophia Chen', '+1 (555) 678-9921', 'sophia.chen@designhub.org', '350 Silicon Valley Way, San Jose', [1006]),
            new Customer(105, 'David Miller', '+1 (555) 314-1592', 'david.m@apexautomotive.com', '19 Ocean Drive, Miami', [1007, 1008])
        ];

        this.vehicles = [
            new Vehicle(1001, 'KA-01-MJ-4589', 'Sedan', 'Toyota', 'Camry Hybrid', 2022, 38500, 101, 35000, '2026-06-15'),
            new Vehicle(1002, 'KA-05-NB-1120', 'SUV', 'BMW', 'X5 xDrive40i', 2021, 54200, 101, 48000, '2026-03-10'),
            new Vehicle(1003, 'MH-12-DE-9911', 'Electric', 'Tesla', 'Model 3 Long Range', 2023, 29000, 102, 25000, '2026-07-01'),
            new Vehicle(1004, 'DL-03-TC-7740', 'Truck', 'Ford', 'F-150 SuperCrew', 2019, 98400, 103, 85000, '2026-01-20'),
            new Vehicle(1005, 'DL-01-AB-3321', 'Sedan', 'Honda', 'Accord Sport', 2020, 68000, 103, 60000, '2026-04-18'),
            new Vehicle(1006, 'KA-03-EQ-8842', 'Hatchback', 'Volkswagen', 'Golf GTI', 2022, 32100, 104, 30000, '2026-08-05'),
            new Vehicle(1007, 'MH-04-KL-5561', 'SUV', 'Hyundai', 'Palisade Limited', 2023, 19500, 105, 15000, '2026-07-22'),
            new Vehicle(1008, 'TN-07-XY-2024', 'Sedan', 'Mercedes-Benz', 'E 350 Sedan', 2018, 112000, 105, 98000, '2025-11-12')
        ];

        this.services = [
            new BasicService(2001, 1001, 'KA-01-MJ-4589', '2026-06-15', 80.0, 35000, 45.0, '0W-20 Synthetic Blend', 10.0, 'Completed', 'Standard 35k km oil & oil filter replacement'),
            new BasicService(2002, 1006, 'KA-03-EQ-8842', '2026-08-05', 85.0, 30000, 55.0, '5W-40 Castrol Edge', 0.0, 'Completed', 'Engine oil change and tire pressure check'),
            new BasicService(2003, 1007, 'MH-04-KL-5561', '2026-07-22', 75.0, 15000, 40.0, '5W-30 Full Synthetic', 15.0, 'Completed', 'Initial 15,000 km routine checkup'),
            new PremiumService(2004, 1002, 'KA-05-NB-1120', '2026-03-10', 150.0, 48000, 95.0, 80.0, 65.0, 50.0, 'Completed', 'Full 150-point inspection and synthetic oil change'),
            new PremiumService(2005, 1003, 'MH-12-DE-9911', '2026-07-01', 160.0, 25000, 110.0, 0.0, 85.0, 60.0, 'Completed', 'Tesla EV battery diagnostics and cabin HEPA filter change'),
            new PremiumService(2006, 1005, 'DL-01-AB-3321', '2026-04-18', 140.0, 60000, 85.0, 65.0, 50.0, 45.0, 'Completed', '60,000 km major service spark plugs and transmission fluid'),
            new PremiumService(2007, 1008, 'TN-07-XY-2024', '2025-11-12', 175.0, 98000, 120.0, 90.0, 70.0, 55.0, 'Completed', 'Comprehensive luxury inspection and sensor recalibration'),
            new EmergencyService(2008, 1004, 'DL-03-TC-7740', '2026-01-20', 180.0, 85000, 140.0, 95.0, 110.0, true, 'Completed', 'Highway alternator failure breakdown towing and battery replacement'),
            new EmergencyService(2009, 1008, 'TN-07-XY-2024', '2026-02-14', 200.0, 104000, 150.0, 100.0, 125.0, true, 'Completed', 'Coolant leak emergency recovery and hose clamp replacement'),
            new BasicService(2010, 1001, 'KA-01-MJ-4589', '2026-09-01', 80.0, 38500, 50.0, '0W-20 Full Synthetic', 5.0, 'In Progress', 'Scheduled brake pad inspection and fluid top-up')
        ];
    },

    save() {
        localStorage.setItem('autocare_customers', JSON.stringify(this.customers));
        localStorage.setItem('autocare_vehicles', JSON.stringify(this.vehicles));
        
        const serializedServices = this.services.map(s => {
            const base = {
                type: s.getServiceType(),
                id: s.id, vehicleId: s.vehicleId, vehicleReg: s.vehicleReg,
                date: s.date, baseCost: s.baseCost, km: s.km, status: s.status, notes: s.notes
            };
            if (s instanceof BasicService) {
                return { ...base, partsCost: s.partsCost, oilGrade: s.oilGrade, discount: s.discount };
            } else if (s instanceof PremiumService) {
                return { ...base, inspectionFee: s.inspectionFee, synthOilCharge: s.synthOilCharge, detailingCharge: s.detailingCharge, diagnosticScanFee: s.diagnosticScanFee };
            } else if (s instanceof EmergencyService) {
                return { ...base, towingFee: s.towingFee, rapidDiag: s.rapidDiag, overtimeLabor: s.overtimeLabor, roadside: s.roadside };
            }
            return base;
        });
        localStorage.setItem('autocare_services', JSON.stringify(serializedServices));
    },

    loadFromJSON(rawC, rawV, rawS) {
        this.customers = rawC.map(c => new Customer(c._id, c._name, c._phone, c._email, c._address, c._vehicleIds));
        this.vehicles = rawV.map(v => new Vehicle(v._id, v._regNum, v._type, v._brand, v._model, v._year, v._km, v._ownerId, v._lastServiceKm, v._lastServiceDate));
        this.services = rawS.map(s => {
            if (s.type === 'Basic Service') {
                return new BasicService(s.id, s.vehicleId, s.vehicleReg, s.date, s.baseCost, s.km, s.partsCost, s.oilGrade, s.discount, s.status, s.notes);
            } else if (s.type === 'Premium Service') {
                return new PremiumService(s.id, s.vehicleId, s.vehicleReg, s.date, s.baseCost, s.km, s.inspectionFee, s.synthOilCharge, s.detailingCharge, s.diagnosticScanFee, s.status, s.notes);
            } else {
                return new EmergencyService(s.id, s.vehicleId, s.vehicleReg, s.date, s.baseCost, s.km, s.towingFee, s.rapidDiag, s.overtimeLabor, s.roadside, s.status, s.notes);
            }
        });
    },

    findVehicle(idOrReg) {
        return this.vehicles.find(v => v.id === Number(idOrReg) || v.regNum.toUpperCase() === String(idOrReg).toUpperCase());
    },

    findCustomer(id) {
        return this.customers.find(c => c.id === Number(id));
    },

    calculateTotalRevenue() {
        return this.services.reduce((sum, s) => sum + s.calculateCost(), 0);
    }
};

// ==========================================================================
// 4. UI CONTROLLER & EVENT LISTENERS
// ==========================================================================

const UI = {
    init() {
        this.bindNavigation();
        this.bindAuth();
        this.bindForms();
        this.bindPlanner();
        this.bindServices();
        this.bindReports();
        this.bindSettings();
        this.renderAll();
        this.startClock();
        this.updateAuthDisplay();
    },

    showToast(message, isSuccess = true) {
        const toast = document.getElementById('toast-notification');
        const msgEl = document.getElementById('toast-msg');
        msgEl.textContent = message;
        toast.style.borderColor = isSuccess ? '#10B981' : '#EF4444';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    },

    startClock() {
        const clockEl = document.getElementById('system-clock');
        const update = () => {
            const now = new Date();
            clockEl.textContent = now.toTimeString().split(' ')[0];
        };
        update();
        setInterval(update, 1000);
    },

    bindNavigation() {
        const navButtons = document.querySelectorAll('.nav-item');
        const screens = document.querySelectorAll('.app-screen');
        const pageTitle = document.getElementById('current-screen-title');
        const pageSub = document.getElementById('current-screen-subtitle');

        const screenTitles = {
            splash: ['Welcome to AutoCare 360', 'Smart Maintenance. Safer Journeys.'],
            login: ['Administrator Authentication', 'Enter ID: CAPSTONE and Password: 12345678'],
            dashboard: ['Executive Dashboard', 'Real-time telemetry, KPIs & polymorphic revenue'],
            vehicles: ['Fleet Inventory & Registration', 'Encapsulated vehicle records and validations'],
            customers: ['Customer Profiles & Ownership', 'Inheritance: Person → Customer directory'],
            planner: ['Predictive Maintenance AI', 'Compile-Time Polymorphism (Function Overloading)'],
            services: ['Service Center & Estimator', 'Runtime Polymorphism & Virtual Cost Dispatch'],
            health: ['Vehicle Health Monitor', 'AI-Driven Multi-Factor Component Diagnostics (0-100)'],
            history: ['Service History & Telemetry', 'Comprehensive work order archive with filters'],
            reports: ['Fleet Analytics Reports', 'Executive report generation & export'],
            settings: ['Data Persistence & Settings', 'Active flat-file database storage inspection']
        };

        const switchScreen = (screenName) => {
            navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.screen === screenName));
            screens.forEach(s => s.classList.toggle('active', s.id === `screen-${screenName}`));

            if (screenTitles[screenName]) {
                pageTitle.textContent = screenTitles[screenName][0];
                pageSub.textContent = screenTitles[screenName][1];
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.renderAll();
        };

        this.switchScreen = switchScreen;

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
        });

        const launchLoginBtn = document.getElementById('btn-launch-login');
        if (launchLoginBtn) {
            launchLoginBtn.addEventListener('click', () => switchScreen('login'));
        }

        document.getElementById('btn-launch-dashboard').addEventListener('click', () => switchScreen('dashboard'));
        document.getElementById('btn-quick-demo').addEventListener('click', () => switchScreen('health'));
        document.getElementById('btn-dash-new-service').addEventListener('click', () => switchScreen('services'));

        document.querySelectorAll('.btn-action').forEach(b => {
            b.addEventListener('click', () => switchScreen(b.dataset.nav));
        });

        // Mobile sidebar toggle
        const toggleBtn = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
    },

    bindAuth() {
        const loginForm = document.getElementById('login-form');
        const loginIdInput = document.getElementById('login-id');
        const loginPwdInput = document.getElementById('login-password');
        const loginAlert = document.getElementById('login-alert');
        const loginAlertMsg = document.getElementById('login-alert-msg');
        const autofillBtn = document.getElementById('btn-autofill-login');
        const togglePwdBtn = document.getElementById('btn-toggle-pwd');
        const headerLogoutBtn = document.getElementById('btn-header-logout');
        const sidebarLogoutBtn = document.getElementById('btn-sidebar-logout');

        // Auto-fill Credentials Button
        if (autofillBtn) {
            autofillBtn.addEventListener('click', () => {
                loginIdInput.value = 'CAPSTONE';
                loginPwdInput.value = '12345678';
                loginAlert.classList.add('hidden');
                this.showToast('Credentials filled: ID: CAPSTONE | Pass: 12345678');
            });
        }

        // Show/Hide Password Toggle
        if (togglePwdBtn) {
            togglePwdBtn.addEventListener('click', () => {
                if (loginPwdInput.type === 'password') {
                    loginPwdInput.type = 'text';
                    togglePwdBtn.textContent = '🙈';
                } else {
                    loginPwdInput.type = 'password';
                    togglePwdBtn.textContent = '👁️';
                }
            });
        }

        // Handle Login Submission
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const enteredId = loginIdInput.value.trim().toUpperCase();
                const enteredPwd = loginPwdInput.value.trim();

                // Required Credentials: ID = CAPSTONE, Password = 12345678
                if (enteredId === 'CAPSTONE' && enteredPwd === '12345678') {
                    AppState.isAuthenticated = true;
                    AppState.currentUser = 'CAPSTONE';

                    const remember = document.getElementById('login-remember').checked;
                    if (remember) {
                        localStorage.setItem('autocare_auth', 'CAPSTONE');
                    } else {
                        sessionStorage.setItem('autocare_auth', 'CAPSTONE');
                    }

                    loginAlert.classList.add('hidden');
                    this.showToast('✅ Authentication Successful! Welcome, Administrator (CAPSTONE).', true);
                    this.updateAuthDisplay();
                    this.switchScreen('dashboard');
                } else {
                    loginAlert.classList.remove('hidden');
                    loginAlertMsg.textContent = 'Invalid Credentials! Access ID must be CAPSTONE and Password must be 12345678.';
                    this.showToast('❌ Access Denied: Incorrect ID or Password.', false);
                }
            });
        }

        // Handle Logout
        const performLogout = () => {
            AppState.isAuthenticated = false;
            localStorage.removeItem('autocare_auth');
            sessionStorage.removeItem('autocare_auth');
            this.updateAuthDisplay();
            this.showToast('Logged out successfully.');
            this.switchScreen('login');
        };

        if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', performLogout);
        if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', performLogout);
    },

    updateAuthDisplay() {
        const headerPill = document.getElementById('header-user-pill');
        const headerUserId = document.getElementById('header-user-id');
        const sidebarDisplayName = document.getElementById('user-display-name');

        if (headerUserId) headerUserId.textContent = AppState.currentUser || 'CAPSTONE';
        if (sidebarDisplayName) sidebarDisplayName.textContent = `ID: ${AppState.currentUser || 'CAPSTONE'}`;

        if (headerPill) {
            headerPill.style.display = AppState.isAuthenticated ? 'flex' : 'flex';
        }
    },

    renderAll() {
        this.renderDashboard();
        this.renderVehicles();
        this.renderCustomers();
        this.renderPlanner();
        this.renderServicesPreview();
        this.renderHealth();
        this.renderHistory();
        this.renderReports();
        this.renderSettings();
    },

    // --- SCREEN 2: DASHBOARD ---
    renderDashboard() {
        document.getElementById('kpi-total-vehicles').textContent = AppState.vehicles.length;
        document.getElementById('badge-vehicle-count').textContent = AppState.vehicles.length;
        document.getElementById('badge-customer-count').textContent = AppState.customers.length;

        const dueCount = AppState.vehicles.filter(v => (v.km - v.lastServiceKm) >= 8000).length;
        document.getElementById('kpi-services-due').textContent = dueCount;

        const completedCount = AppState.services.filter(s => s.status === 'Completed').length;
        document.getElementById('kpi-completed-services').textContent = completedCount;

        let highPriorityCount = 0;
        AppState.vehicles.forEach(v => {
            const h = HealthAnalyzer.analyze(v);
            if (h.status === 'Critical' || h.status === 'Needs Attention') highPriorityCount++;
        });
        document.getElementById('kpi-high-priority').textContent = highPriorityCount;

        document.getElementById('dashboard-total-revenue').textContent = `$${AppState.calculateTotalRevenue().toFixed(2)}`;

        // Render recent services table
        const tbody = document.getElementById('dashboard-services-body');
        tbody.innerHTML = '';
        const recent = [...AppState.services].reverse().slice(0, 5);

        recent.forEach(s => {
            const tr = document.createElement('tr');
            const tierClass = s instanceof EmergencyService ? 'badge-crimson' : (s instanceof PremiumService ? 'badge-indigo' : 'badge-cyan');
            tr.innerHTML = `
                <td><strong>#${s.id}</strong></td>
                <td><span class="badge badge-cyan">${s.vehicleReg}</span></td>
                <td><span class="badge ${tierClass}">${s.getServiceType()}</span></td>
                <td>${s.date}</td>
                <td>${s.km.toLocaleString()} km</td>
                <td><strong class="emerald-text">$${s.calculateCost().toFixed(2)}</strong></td>
                <td><span class="badge badge-emerald">${s.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    },

    // --- SCREEN 3: VEHICLES ---
    renderVehicles() {
        const tbody = document.getElementById('vehicles-table-body');
        const ownerSelect = document.getElementById('v-owner');
        const srvVehicleSelect = document.getElementById('srv-vehicle');
        const plannerVehicleSelect = document.getElementById('planner-vehicle-select');

        // Populate Owner Select options
        ownerSelect.innerHTML = AppState.customers.map(c => `<option value="${c.id}">${c.name} (ID: ${c.id})</option>`).join('');
        
        // Populate Vehicle selectors
        const vOptions = AppState.vehicles.map(v => `<option value="${v.id}">${v.regNum} - ${v.brand} ${v.model} (${v.type})</option>`).join('');
        srvVehicleSelect.innerHTML = vOptions;
        plannerVehicleSelect.innerHTML = vOptions;
        plannerVehicleSelect.value = AppState.activePlannerVehicleId;

        tbody.innerHTML = '';
        const query = document.getElementById('search-vehicles').value.toLowerCase();

        AppState.vehicles.forEach(v => {
            if (query && !v.regNum.toLowerCase().includes(query) && !v.brand.toLowerCase().includes(query) && !v.model.toLowerCase().includes(query)) return;

            const owner = AppState.findCustomer(v.ownerId);
            const health = HealthAnalyzer.analyze(v);
            const tr = document.createElement('tr');
            if (v.id === AppState.selectedVehicleId) tr.classList.add('selected');

            tr.innerHTML = `
                <td><strong>#${v.id}</strong></td>
                <td><span class="badge badge-cyan">${v.regNum}</span></td>
                <td>${v.brand} ${v.model}</td>
                <td><span class="badge badge-indigo">${v.type}</span></td>
                <td>${v.year}</td>
                <td>${v.km.toLocaleString()} km</td>
                <td>${owner ? owner.name : 'Unknown'}</td>
                <td><span class="badge ${health.statusClass}">${health.score}/100</span></td>
            `;

            tr.addEventListener('click', () => {
                AppState.selectedVehicleId = v.id;
                this.loadVehicleToForm(v);
                this.renderVehicles();
            });
            tbody.appendChild(tr);
        });
    },

    loadVehicleToForm(v) {
        document.getElementById('v-id').value = v.id;
        document.getElementById('v-reg').value = v.regNum;
        document.getElementById('v-brand').value = v.brand;
        document.getElementById('v-model').value = v.model;
        document.getElementById('v-type').value = v.type;
        document.getElementById('v-year').value = v.year;
        document.getElementById('v-km').value = v.km;
        document.getElementById('v-owner').value = v.ownerId;
    },

    // --- SCREEN 4: CUSTOMERS ---
    renderCustomers() {
        const tbody = document.getElementById('customers-table-body');
        tbody.innerHTML = '';
        const query = document.getElementById('search-customers').value.toLowerCase();

        AppState.customers.forEach(c => {
            if (query && !c.name.toLowerCase().includes(query) && !c.phone.includes(query) && !c.email.toLowerCase().includes(query)) return;

            const tr = document.createElement('tr');
            if (c.id === AppState.selectedCustomerId) tr.classList.add('selected');

            tr.innerHTML = `
                <td><strong>#${c.id}</strong></td>
                <td><strong>${c.name}</strong></td>
                <td>${c.phone}</td>
                <td>${c.email}</td>
                <td>${c.address}</td>
                <td><span class="badge badge-indigo">${c.vehicleIds.length} Vehicle(s)</span></td>
            `;

            tr.addEventListener('click', () => {
                AppState.selectedCustomerId = c.id;
                this.loadCustomerToForm(c);
                this.renderCustomers();
            });
            tbody.appendChild(tr);
        });
    },

    loadCustomerToForm(c) {
        document.getElementById('c-id').value = c.id;
        document.getElementById('c-name').value = c.name;
        document.getElementById('c-phone').value = c.phone;
        document.getElementById('c-email').value = c.email;
        document.getElementById('c-address').value = c.address;
    },

    // --- SCREEN 5: SMART PLANNER ---
    bindPlanner() {
        const vSelect = document.getElementById('planner-vehicle-select');
        vSelect.addEventListener('change', (e) => {
            AppState.activePlannerVehicleId = Number(e.target.value);
            this.renderPlanner();
        });

        const catBtns = document.querySelectorAll('.cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.activePlannerCategory = btn.dataset.cat;
                this.renderPlanner();
            });
        });
    },

    renderPlanner() {
        const vehicle = AppState.findVehicle(AppState.activePlannerVehicleId) || AppState.vehicles[0];
        if (!vehicle) return;

        document.getElementById('planner-cur-km').value = vehicle.km;
        document.getElementById('planner-last-km').value = vehicle.lastServiceKm;
        document.getElementById('planner-matrix-subtitle').textContent = `${vehicle.regNum} • ${vehicle.brand} ${vehicle.model} (${vehicle.type}, ${vehicle.year})`;

        const health = HealthAnalyzer.analyze(vehicle);
        const nextKm = MaintenancePlanner.calculateNextService(vehicle.km, vehicle.type, AppState.activePlannerCategory);
        const remaining = nextKm - vehicle.km;
        const priority = MaintenancePlanner.determinePriority(vehicle.km, vehicle.lastServiceKm, AppState.activePlannerCategory, health.score);
        const estDate = MaintenancePlanner.calculateEstimatedDate(vehicle.km, nextKm);
        const estCost = MaintenancePlanner.estimateCost(AppState.activePlannerCategory, vehicle.type);

        document.getElementById('res-next-km').textContent = `${nextKm.toLocaleString()} km`;
        document.getElementById('res-km-remaining').textContent = `${remaining.toLocaleString()} km remaining`;
        document.getElementById('res-priority-badge').innerHTML = `<span class="badge ${priority.class}">${priority.level}</span>`;
        document.getElementById('res-priority-sub').textContent = `Health Factor: ${health.score}/100`;
        document.getElementById('res-est-date').textContent = estDate;
        document.getElementById('res-est-cost').textContent = `$${estCost.toFixed(2)}`;
        document.getElementById('res-advisory-text').textContent = priority.advice;
    },

    // --- SCREEN 6: SERVICE MANAGEMENT & POLYMORPHISM ---
    bindServices() {
        const tierTabs = document.querySelectorAll('.tier-tab');
        const basicGroup = document.getElementById('tier-inputs-basic');
        const premGroup = document.getElementById('tier-inputs-premium');
        const emergGroup = document.getElementById('tier-inputs-emergency');

        tierTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tierTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                AppState.activeTier = tab.dataset.tier;

                basicGroup.classList.toggle('hidden', AppState.activeTier !== 'BASIC');
                premGroup.classList.toggle('hidden', AppState.activeTier !== 'PREMIUM');
                emergGroup.classList.toggle('hidden', AppState.activeTier !== 'EMERGENCY');

                this.renderServicesPreview();
            });
        });

        document.querySelectorAll('.calc-trigger').forEach(input => {
            input.addEventListener('input', () => this.renderServicesPreview());
        });

        document.getElementById('service-booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleServiceBooking();
        });
    },

    renderServicesPreview() {
        const baseCost = Number(document.getElementById('srv-base').value) || 0;
        let total = 0;

        const classLabel = document.getElementById('formula-class');
        const exprLabel = document.getElementById('formula-expr');
        const descLabel = document.getElementById('formula-desc');

        if (AppState.activeTier === 'BASIC') {
            const parts = Number(document.getElementById('srv-parts').value) || 0;
            const disc = Number(document.getElementById('srv-discount').value) || 0;
            total = Math.max(0, (baseCost + parts) - disc);

            classLabel.textContent = 'BasicService::calculateCost()';
            exprLabel.textContent = 'Total = (BaseCost + PartsCost) - LabourDiscount';
            descLabel.textContent = 'Virtual function dynamically dispatched at runtime. Computes standard routine maintenance.';
        } else if (AppState.activeTier === 'PREMIUM') {
            const insp = Number(document.getElementById('srv-insp').value) || 0;
            const synth = Number(document.getElementById('srv-synth').value) || 0;
            const detail = Number(document.getElementById('srv-detail').value) || 0;
            const scan = Number(document.getElementById('srv-scan').value) || 0;
            total = baseCost + insp + synth + detail + scan;

            classLabel.textContent = 'PremiumService::calculateCost()';
            exprLabel.textContent = 'Total = BaseCost + InspectionFee + SyntheticOil + Detailing + OBDScan';
            descLabel.textContent = 'Overrides base Service class with multi-point luxury diagnostic and detailing charges.';
        } else {
            const tow = Number(document.getElementById('srv-towing').value) || 0;
            const overtime = Number(document.getElementById('srv-overtime').value) || 0;
            const rapid = Number(document.getElementById('srv-rapid').value) || 0;
            const roadside = document.getElementById('srv-roadside').checked ? 50.0 : 0.0;
            total = baseCost + tow + overtime + rapid + roadside;

            classLabel.textContent = 'EmergencyService::calculateCost()';
            exprLabel.textContent = 'Total = BaseCost + EmergencyTowing + RapidDiagnostics + Overtime + Roadside';
            descLabel.textContent = 'Computes urgent roadside recovery, breakdown towing, and emergency technician dispatch.';
        }

        document.getElementById('live-calculated-cost').textContent = `$${total.toFixed(2)}`;
    },

    handleServiceBooking() {
        const vId = Number(document.getElementById('srv-vehicle').value);
        const vehicle = AppState.findVehicle(vId);
        if (!vehicle) return;

        const date = document.getElementById('srv-date').value || '2026-09-02';
        const baseCost = Number(document.getElementById('srv-base').value) || 80.0;
        const km = Number(document.getElementById('srv-km').value) || vehicle.km;
        const notes = document.getElementById('srv-notes').value || 'Work order completed';

        let newService;
        const sId = 2000 + AppState.services.length + 1;

        if (AppState.activeTier === 'BASIC') {
            const parts = Number(document.getElementById('srv-parts').value) || 0;
            const oil = document.getElementById('srv-oil').value;
            const disc = Number(document.getElementById('srv-discount').value) || 0;
            newService = new BasicService(sId, vId, vehicle.regNum, date, baseCost, km, parts, oil, disc, 'Completed', notes);
        } else if (AppState.activeTier === 'PREMIUM') {
            const insp = Number(document.getElementById('srv-insp').value) || 75.0;
            const synth = Number(document.getElementById('srv-synth').value) || 60.0;
            const detail = Number(document.getElementById('srv-detail').value) || 50.0;
            const scan = Number(document.getElementById('srv-scan').value) || 40.0;
            newService = new PremiumService(sId, vId, vehicle.regNum, date, baseCost, km, insp, synth, detail, scan, 'Completed', notes);
        } else {
            const tow = Number(document.getElementById('srv-towing').value) || 120.0;
            const overtime = Number(document.getElementById('srv-overtime').value) || 95.0;
            const rapid = Number(document.getElementById('srv-rapid').value) || 80.0;
            const roadside = document.getElementById('srv-roadside').checked;
            newService = new EmergencyService(sId, vId, vehicle.regNum, date, baseCost, km, tow, rapid, overtime, roadside, 'Completed', notes);
        }

        AppState.services.push(newService);
        vehicle.recordCompletedService(km, date);
        AppState.save();

        this.showToast(`${newService.getServiceType()} booked successfully! Invoiced: $${newService.calculateCost().toFixed(2)}`);
        this.renderAll();
    },

    // --- SCREEN 7: VEHICLE HEALTH MONITOR ---
    renderHealth() {
        const listEl = document.getElementById('health-fleet-list');
        listEl.innerHTML = '';

        AppState.vehicles.forEach(v => {
            const health = HealthAnalyzer.analyze(v);
            const item = document.createElement('div');
            item.className = `health-fleet-item ${v.id === AppState.selectedVehicleId ? 'active' : ''}`;
            item.innerHTML = `
                <div>
                    <div class="hf-reg">${v.regNum}</div>
                    <div class="hf-desc">${v.brand} ${v.model} (${v.km.toLocaleString()} km)</div>
                </div>
                <div class="hf-score" style="color: ${health.color}">${health.score}</div>
            `;
            item.addEventListener('click', () => {
                AppState.selectedVehicleId = v.id;
                this.renderHealth();
            });
            listEl.appendChild(item);
        });

        const activeVehicle = AppState.findVehicle(AppState.selectedVehicleId) || AppState.vehicles[0];
        if (!activeVehicle) return;

        const health = HealthAnalyzer.analyze(activeVehicle);
        document.getElementById('health-target-title').textContent = `AI Diagnostics: ${activeVehicle.regNum}`;
        document.getElementById('health-target-subtitle').textContent = `${activeVehicle.brand} ${activeVehicle.model} (${activeVehicle.type}, ${activeVehicle.year})`;

        // Animate SVG Gauge
        const circle = document.getElementById('health-gauge-circle');
        const circumference = 2 * Math.PI * 68; // ~427.25
        const offset = circumference - (health.score / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = health.color;

        const scoreVal = document.getElementById('health-score-val');
        scoreVal.textContent = health.score;
        scoreVal.style.color = health.color;

        const badge = document.getElementById('health-score-status');
        badge.textContent = health.status;
        badge.style.color = health.color;

        document.getElementById('health-stat-km').textContent = `${activeVehicle.km.toLocaleString()} km`;
        document.getElementById('health-stat-last-km').textContent = `Last service at ${activeVehicle.lastServiceKm.toLocaleString()} km`;

        // Progress bars
        document.getElementById('val-engine').textContent = `${health.engine}%`;
        document.getElementById('bar-engine').style.width = `${health.engine}%`;

        document.getElementById('val-brake').textContent = `${health.brake}%`;
        document.getElementById('bar-brake').style.width = `${health.brake}%`;

        document.getElementById('val-battery').textContent = `${health.battery}%`;
        document.getElementById('bar-battery').style.width = `${health.battery}%`;

        document.getElementById('val-suspension').textContent = `${health.suspension}%`;
        document.getElementById('bar-suspension').style.width = `${health.suspension}%`;

        let advice = "OPTIMAL STATUS: Vehicle running at peak factory performance.";
        if (health.score < 40) advice = "CRITICAL: Urgent comprehensive overhaul required before further operation.";
        else if (health.score < 60) advice = "ATTENTION RECOMMENDED: Schedule fluid flush and brake inspection within 200 km.";
        else if (health.score < 80) advice = "GOOD CONDITION: Minor wear detected. Plan routine maintenance in next 2,000 km.";

        document.getElementById('health-recommendation-text').textContent = advice;
    },

    // --- SCREEN 8: SERVICE HISTORY ---
    renderHistory() {
        const tbody = document.getElementById('history-table-body');
        tbody.innerHTML = '';
        const query = document.getElementById('search-history').value.toLowerCase();

        AppState.services.forEach(s => {
            if (AppState.activeHistoryFilter !== 'ALL' && s.getServiceType() !== AppState.activeHistoryFilter) return;
            if (query && !s.vehicleReg.toLowerCase().includes(query)) return;

            const tr = document.createElement('tr');
            const tierClass = s instanceof EmergencyService ? 'badge-crimson' : (s instanceof PremiumService ? 'badge-indigo' : 'badge-cyan');
            tr.innerHTML = `
                <td><strong>#${s.id}</strong></td>
                <td><span class="badge badge-cyan">${s.vehicleReg}</span></td>
                <td><span class="badge ${tierClass}">${s.getServiceType()}</span></td>
                <td>${s.date}</td>
                <td>${s.km.toLocaleString()} km</td>
                <td><strong class="emerald-text">$${s.calculateCost().toFixed(2)}</strong></td>
                <td><span class="badge badge-emerald">${s.status}</span></td>
                <td>${s.notes}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    // --- SCREEN 9: REPORTS ---
    bindReports() {
        const reportBtns = document.querySelectorAll('.report-menu-btn');
        reportBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                reportBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.activeReportType = btn.dataset.rep;
                this.renderReports();
            });
        });

        document.getElementById('btn-download-report').addEventListener('click', () => {
            const text = document.getElementById('report-terminal-output').textContent;
            const blob = new Blob([text], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `AutoCare360_${AppState.activeReportType.toUpperCase()}_REPORT.txt`;
            a.click();
            this.showToast('Report exported and downloaded successfully!');
        });

        document.getElementById('btn-download-csv').addEventListener('click', () => {
            let csv = 'Service_ID,Vehicle_Reg,Service_Type,Date,Odometer_Km,Cost_USD,Status,Notes\n';
            AppState.services.forEach(s => {
                csv += `${s.id},"${s.vehicleReg}","${s.getServiceType()}","${s.date}",${s.km},${s.calculateCost().toFixed(2)},"${s.status}","${s.notes}"\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'AutoCare360_Fleet_Services.csv';
            a.click();
            this.showToast('CSV dataset exported and downloaded successfully!');
        });
    },

    renderReports() {
        const terminal = document.getElementById('report-terminal-output');
        let content = '';

        if (AppState.activeReportType === 'financial') {
            let basicRev = 0, premRev = 0, emergRev = 0;
            let bCount = 0, pCount = 0, eCount = 0;

            AppState.services.forEach(s => {
                const cost = s.calculateCost();
                if (s instanceof BasicService) { basicRev += cost; bCount++; }
                else if (s instanceof PremiumService) { premRev += cost; pCount++; }
                else if (s instanceof EmergencyService) { emergRev += cost; eCount++; }
            });
            const total = basicRev + premRev + emergRev;

            content = `========================================================================================
                    AUTOCARE 360 - FINANCIAL & SERVICE REVENUE BREAKDOWN
========================================================================================
Service Category        Work Orders       Total Revenue ($)        Revenue Share (%)
----------------------------------------------------------------------------------------
Basic Service           ${String(bCount).padEnd(16)}  $${basicRev.toFixed(2).padEnd(20)}  ${(basicRev/total*100).toFixed(1)}%
Premium Service         ${String(pCount).padEnd(16)}  $${premRev.toFixed(2).padEnd(20)}  ${(premRev/total*100).toFixed(1)}%
Emergency Service       ${String(eCount).padEnd(16)}  $${emergRev.toFixed(2).padEnd(20)}  ${(emergRev/total*100).toFixed(1)}%
----------------------------------------------------------------------------------------
TOTAL FLEET REVENUE  :  $${total.toFixed(2)}
TOTAL TRANSACTIONS   :  ${AppState.services.length}
EXECUTION ENGINE     :  C++17 Polymorphic Dynamic Dispatch (vtable)
========================================================================================`;
        } else if (AppState.activeReportType === 'vehicle') {
            const v = AppState.findVehicle(AppState.selectedVehicleId) || AppState.vehicles[0];
            const owner = AppState.findCustomer(v.ownerId);
            const health = HealthAnalyzer.analyze(v);

            content = `========================================================================================
                    AUTOCARE 360 - VEHICLE DIAGNOSTIC & SERVICE REPORT
========================================================================================
Vehicle ID      : ${v.id}
Registration No : ${v.regNum}
Make & Model    : ${v.year} ${v.brand} ${v.model} (${v.type})
Odometer Reading: ${v.km.toLocaleString()} km
Last Service    : ${v.lastServiceKm.toLocaleString()} km on ${v.lastServiceDate}
Registered Owner: ${owner ? owner.name : 'N/A'} (Phone: ${owner ? owner.phone : 'N/A'})
----------------------------------------------------------------------------------------
HEALTH ASSESSMENT (AI 0-100 INDEX):
Overall Score   : ${health.score}/100 (${health.status})
Telemetry       : Powertrain: ${health.engine}% | Brakes: ${health.brake}% | Battery: ${health.battery}% | Suspension: ${health.suspension}%
========================================================================================`;
        } else if (AppState.activeReportType === 'upcoming') {
            content = `========================================================================================
                    AUTOCARE 360 - UPCOMING SMART MAINTENANCE SCHEDULE
========================================================================================
ID       Registration      Make & Model        Current Km   Next Svc Km  Priority   Est Date
----------------------------------------------------------------------------------------\n`;
            AppState.vehicles.forEach(v => {
                const nextKm = MaintenancePlanner.calculateNextService(v.km, v.type, 'General Service');
                const priority = MaintenancePlanner.determinePriority(v.km, v.lastServiceKm, 'General Service', 80);
                const estDate = MaintenancePlanner.calculateEstimatedDate(v.km, nextKm);
                content += `${String(v.id).padEnd(8)} ${v.regNum.padEnd(17)} ${(v.brand + ' ' + v.model).padEnd(19)} ${String(v.km).padEnd(12)} ${String(nextKm).padEnd(12)} ${priority.level.padEnd(10)} ${estDate}\n`;
            });
            content += `========================================================================================`;
        } else if (AppState.activeReportType === 'priority') {
            content = `========================================================================================
                    AUTOCARE 360 - HIGH PRIORITY & CRITICAL FLEET ALERTS
========================================================================================\n`;
            let count = 0;
            AppState.vehicles.forEach(v => {
                const h = HealthAnalyzer.analyze(v);
                if (h.status === 'Critical' || h.status === 'Needs Attention') {
                    count++;
                    content += `Vehicle ID   : ${v.id} | Reg: ${v.regNum}\n`;
                    content += `Model        : ${v.year} ${v.brand} ${v.model}\n`;
                    content += `Health Score : ${h.score}/100 (${h.status})\n`;
                    content += `Recommendation: Schedule urgent mechanical overhaul\n----------------------------------------------------------------------------------------\n`;
                }
            });
            content += `Total Critical Fleet Items: ${count}\n========================================================================================`;
        } else {
            content = `========================================================================================
                    AUTOCARE 360 - CUSTOMER PORTFOLIO REPORT
========================================================================================\n`;
            AppState.customers.forEach(c => {
                content += `Customer ID   : ${c.id}\nName          : ${c.name}\nPhone / Email : ${c.phone} | ${c.email}\nAddress       : ${c.address}\nVehicles Owned: ${c.vehicleIds.length} vehicle(s)\n----------------------------------------------------------------------------------------\n`;
            });
            content += `========================================================================================`;
        }

        terminal.textContent = content;
    },

    // --- SCREEN 10: SETTINGS & RAW DB INSPECTION ---
    bindSettings() {
        document.getElementById('btn-reset-sample-data').addEventListener('click', () => {
            if (confirm('Reset to default pre-loaded sample dataset?')) {
                localStorage.clear();
                AppState.loadDefaultDataset();
                AppState.save();
                this.renderAll();
                this.showToast('Sample dataset restored!');
            }
        });

        const dbTabs = document.querySelectorAll('.db-tab-btn');
        dbTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                dbTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderSettings(tab.dataset.db);
            });
        });
    },

    renderSettings(dbType = 'vehicles') {
        const rawPre = document.getElementById('raw-db-preview');
        if (!rawPre) return;

        if (dbType === 'vehicles') {
            rawPre.textContent = `# AutoCare 360 Vehicle Database\n# Format: ID|RegNum|Type|Brand|Model|Year|Km|OwnerId|LastServiceKm|LastServiceDate\n` +
                AppState.vehicles.map(v => `${v.id}|${v.regNum}|${v.type}|${v.brand}|${v.model}|${v.year}|${v.km}|${v.ownerId}|${v.lastServiceKm}|${v.lastServiceDate}`).join('\n');
        } else if (dbType === 'customers') {
            rawPre.textContent = `# AutoCare 360 Customer Database\n# Format: ID|Name|Phone|Email|Address|VehicleId1,VehicleId2,...\n` +
                AppState.customers.map(c => `${c.id}|${c.name}|${c.phone}|${c.email}|${c.address}|${c.vehicleIds.join(',')}`).join('\n');
        } else {
            rawPre.textContent = `# AutoCare 360 Service Database (Polymorphic)\n# Format: TYPE|serviceId|vehicleId|vehicleReg|serviceDate|baseCost|km|status|notes|...\n` +
                AppState.services.map(s => {
                    if (s instanceof BasicService) return `BASIC|${s.id}|${s.vehicleId}|${s.vehicleReg}|${s.date}|${s.baseCost}|${s.km}|${s.status}|${s.notes}|${s.partsCost}|${s.oilGrade}|${s.discount}`;
                    if (s instanceof PremiumService) return `PREMIUM|${s.id}|${s.vehicleId}|${s.vehicleReg}|${s.date}|${s.baseCost}|${s.km}|${s.status}|${s.notes}|${s.inspectionFee}|${s.synthOilCharge}|${s.detailingCharge}|${s.diagnosticScanFee}`;
                    return `EMERGENCY|${s.id}|${s.vehicleId}|${s.vehicleReg}|${s.date}|${s.baseCost}|${s.km}|${s.status}|${s.notes}|${s.towingFee}|${s.rapidDiag}|${s.overtimeLabor}|${s.roadside ? '1' : '0'}`;
                }).join('\n');
        }
    },

    bindForms() {
        // Vehicle Form
        document.getElementById('vehicle-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = Number(document.getElementById('v-id').value) || (1000 + AppState.vehicles.length + 1);
            const reg = document.getElementById('v-reg').value.trim();
            const brand = document.getElementById('v-brand').value.trim();
            const model = document.getElementById('v-model').value.trim();
            const type = document.getElementById('v-type').value;
            const year = Number(document.getElementById('v-year').value);
            const km = Number(document.getElementById('v-km').value);
            const ownerId = Number(document.getElementById('v-owner').value);

            const duplicate = AppState.vehicles.find(v => v.regNum.toUpperCase() === reg.toUpperCase() && v.id !== id);
            if (duplicate) {
                this.showToast(`Error: Plate ${reg} is already registered!`, false);
                return;
            }

            const newV = new Vehicle(id, reg, type, brand, model, year, km, ownerId, km, 'N/A');
            AppState.vehicles.push(newV);

            const owner = AppState.findCustomer(ownerId);
            if (owner) owner.addVehicle(id);

            AppState.save();
            this.showToast(`Vehicle ${reg} registered successfully!`);
            this.renderAll();
        });

        document.getElementById('btn-update-vehicle').addEventListener('click', () => {
            const id = Number(document.getElementById('v-id').value);
            const vehicle = AppState.findVehicle(id);
            if (!vehicle) {
                this.showToast('Please select a vehicle first.', false);
                return;
            }
            vehicle.regNum = document.getElementById('v-reg').value;
            vehicle.brand = document.getElementById('v-brand').value;
            vehicle.model = document.getElementById('v-model').value;
            vehicle.type = document.getElementById('v-type').value;
            vehicle.year = document.getElementById('v-year').value;
            vehicle.km = document.getElementById('v-km').value;
            vehicle.ownerId = document.getElementById('v-owner').value;

            AppState.save();
            this.showToast(`Vehicle #${id} updated successfully!`);
            this.renderAll();
        });

        document.getElementById('btn-delete-vehicle').addEventListener('click', () => {
            const id = Number(document.getElementById('v-id').value);
            if (!id) return;
            AppState.vehicles = AppState.vehicles.filter(v => v.id !== id);
            AppState.customers.forEach(c => c.removeVehicle(id));
            AppState.save();
            this.showToast(`Vehicle #${id} deleted.`);
            this.renderAll();
        });

        document.getElementById('btn-clear-vehicle').addEventListener('click', () => {
            document.getElementById('vehicle-form').reset();
            document.getElementById('v-id').value = '';
        });

        // Customer Form
        document.getElementById('customer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = Number(document.getElementById('c-id').value) || (100 + AppState.customers.length + 1);
            const name = document.getElementById('c-name').value.trim();
            const phone = document.getElementById('c-phone').value.trim();
            const email = document.getElementById('c-email').value.trim();
            const address = document.getElementById('c-address').value.trim();

            const newC = new Customer(id, name, phone, email, address);
            AppState.customers.push(newC);
            AppState.save();
            this.showToast(`Customer '${name}' registered successfully!`);
            this.renderAll();
        });

        document.getElementById('btn-update-customer').addEventListener('click', () => {
            const id = Number(document.getElementById('c-id').value);
            const customer = AppState.findCustomer(id);
            if (!customer) {
                this.showToast('Please select a customer first.', false);
                return;
            }
            customer.name = document.getElementById('c-name').value;
            customer.phone = document.getElementById('c-phone').value;
            customer.email = document.getElementById('c-email').value;
            customer.address = document.getElementById('c-address').value;

            AppState.save();
            this.showToast(`Customer #${id} updated!`);
            this.renderAll();
        });

        document.getElementById('btn-delete-customer').addEventListener('click', () => {
            const id = Number(document.getElementById('c-id').value);
            if (!id) return;
            AppState.customers = AppState.customers.filter(c => c.id !== id);
            AppState.save();
            this.showToast(`Customer #${id} removed.`);
            this.renderAll();
        });

        document.getElementById('btn-clear-customer').addEventListener('click', () => {
            document.getElementById('customer-form').reset();
            document.getElementById('c-id').value = '';
        });

        // Search inputs
        document.getElementById('search-vehicles').addEventListener('input', () => this.renderVehicles());
        document.getElementById('search-customers').addEventListener('input', () => this.renderCustomers());
        document.getElementById('search-history').addEventListener('input', () => this.renderHistory());

        // History filter pills
        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.activeHistoryFilter = btn.dataset.filter;
                this.renderHistory();
            });
        });
    }
};

// Initialize Application upon DOM load
document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    UI.init();
});
