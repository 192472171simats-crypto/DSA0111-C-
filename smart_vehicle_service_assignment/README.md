# AutoCare 360 – Smart Vehicle Service and Maintenance Management System

> **Modern, High-Performance Object-Oriented C++ Desktop Application with Predictive Diagnostics, Polymorphic Costing, and Native GUI**

[![C++17](https://img.shields.io/badge/C%2B%2B-17-blue.svg?logo=c%2B%2B)](https://en.cppreference.com/w/cpp/17)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Cross--Platform-lightgrey.svg)](https://microsoft.com/windows)
[![License](https://img.shields.io/badge/License-Academic%20MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](build.bat)

---

## 📌 Project Description

**AutoCare 360** is an enterprise-grade automotive service management and smart maintenance forecasting software built in modern **C++17**. Designed from the ground up to demonstrate advanced **Object-Oriented Programming (OOP)** paradigms, it provides automotive service centers, fleet managers, and vehicle owners with an all-in-one suite for vehicle registration, customer profiling, polymorphic service dispatch, predictive maintenance scheduling, real-time vehicle health score analysis (0–100), and automated analytical report generation.

---

## ✨ Key Features & Capabilities

* **Modern Native Desktop GUI**:
  * 9 dedicated screens designed with a sleek dark-mode glassmorphic theme.
  * Custom 60 FPS double-buffered GDI rendering engine (zero screen flicker, ultra-low resource footprint).
  * Interactive KPI dashboard cards, searchable tables, dynamic forms, and an animated circular health gauge.
* **Full Object-Oriented Architecture**:
  * Clean inheritance hierarchies (`Person` $\rightarrow$ `Customer`, `Service` $\rightarrow$ `BasicService` / `PremiumService` / `EmergencyService`).
  * Pure virtual functions and abstract base classes.
  * Dynamic polymorphism through `std::shared_ptr<Service>` collections.
  * Compile-time method overloading for dynamic maintenance calculations.
* **Smart Maintenance Planner**:
  * Calculates next recommended service intervals based on odometer reading and vehicle type (Sedan, SUV, Truck, EV).
  * Multi-factor priority classification: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
  * Date forecasting using average monthly driving telemetry.
* **Vehicle Health Diagnostics (0–100 Score)**:
  * Computes an overall health index and sub-system scores for Powertrain, Brakes, Battery, and Suspension.
  * Categorizes status into `Excellent` (80–100), `Good` (60–79), `Needs Attention` (40–59), and `Critical` (<40).
* **Multi-Format Persistent Storage**:
  * Automatic text-based database engine (`data/vehicles.txt`, `data/customers.txt`, `data/services.txt`).
  * Automatic directory generation, duplicate key protection, and export capabilities to `reports/`.

---

## 🏛️ OOP Concepts Demonstrated

```
                                  +-------------------+
                                  |      Person       |
                                  |-------------------|
                                  | # id, name        |
                                  | # phone, email    |
                                  +---------+---------+
                                            |
                                            | (Inheritance)
                                            v
                                  +-------------------+
                                  |     Customer      |
                                  |-------------------|
                                  | - address         |
                                  | - vehicleIds      |
                                  +---------+---------+
                                            | 1..* (Aggregation)
                                            v
                                  +-------------------+
                                  |      Vehicle      |
                                  |-------------------|
                                  | - vehicleId       |
                                  | - regNumber       |
                                  | - brand, model    |
                                  | - year, km, type  |
                                  +---------+---------+
                                            | 1..*
                                            v
                               +------------+------------+
                               |     Service (Abstract)  |
                               |-------------------------|
                               | # serviceId, vehicleId  |
                               | # serviceDate, baseCost |
                               | + calculateCost() = 0   |
                               | + getServiceType() = 0  |
                               +------------+------------+
                                            |
            +-------------------------------+-------------------------------+
            |                               |                               |
            v                               v                               v
+-----------------------+       +-----------------------+       +-----------------------+
|     BasicService      |       |    PremiumService     |       |   EmergencyService    |
|-----------------------|       |-----------------------|       |-----------------------|
| - partsCost           |       | - inspectionFee       |       | - towingFee           |
| - labourDiscount      |       | - detailingCharge     |       | - overtimeLaborRate   |
| + calculateCost() [O] |       | - diagnosticScanFee   |       | - isRoadsideAssistance|
| + getServiceType()[O] |       | + calculateCost() [O] |       | + calculateCost() [O] |
|                       |       | + getServiceType()[O] |       | + getServiceType()[O] |
+-----------------------+       +-----------------------+       +-----------------------+
```

1. **Classes and Objects**: Clear separation of real-world automotive entities into independent objects with states and behaviors.
2. **Encapsulation & Access Specifiers**:
   - `private`: Sensitive fields (mileage, registration, vehicle IDs) accessible only via validated mutators/accessors.
   - `protected`: Shared base attributes accessible to derived subclasses.
   - `public`: Clean interface exposed to controllers and the UI.
3. **Compile-Time Polymorphism (Function Overloading)**:
   - `MaintenancePlanner::calculateNextService(int currentKm)`
   - `MaintenancePlanner::calculateNextService(int currentKm, string vehicleType, string maintenanceType)`
   - `DataManager::findVehicle(int id)` vs `DataManager::findVehicle(string regNumber)`
4. **Runtime Polymorphism & Virtual Functions**:
   - `Service::calculateCost()` pure virtual function dynamically dispatched across `BasicService`, `PremiumService`, and `EmergencyService`.
   - `std::vector<std::shared_ptr<Service>>` invoking overridden formulas at runtime.
5. **Abstraction**: Abstract Base Class `Service` and `Person` define mandatory interfaces while hiding complex internal arithmetic.

---

## 🛠️ Technologies Used

* **Core Programming Language**: C++17
* **GUI Subsystem**: Native Win32 API & GDI+ Double-Buffered Rendering
* **Build Systems**: Batch Script (`build.bat`), GNU Makefile (`Makefile`), CMake (`CMakeLists.txt`)
* **Persistence**: Structured flat-file database storage (`data/`)
* **Compilers Supported**: MinGW-w64 (GCC), Clang, MSVC

---

## 📂 Project Structure

```
AutoCare360/
├── CMakeLists.txt                  # CMake project configuration
├── Makefile                        # GNU Make build file
├── build.bat                       # 1-click Windows compilation batch script
├── run.bat                         # 1-click Application desktop launcher
├── README.md                       # Comprehensive documentation & guide
├── PSEUDOCODE.md                   # Full end-to-end pseudocode specification
├── REPORT_ANALYSIS_REFLECTIONS.md  # Academic evaluation & student reflections
├── data/                           # Persistent flat-file database storage
│   ├── customers.txt               # Customer accounts & ownership lists
│   ├── vehicles.txt                # Registered vehicle inventory
│   └── services.txt                # Polymorphic service work order history
├── reports/                        # Exported analytical and summary text files
├── include/                        # C++ Header Files (Interface definitions)
│   ├── Person.h                    # Base identity class
│   ├── Customer.h                  # Derived customer class
│   ├── Vehicle.h                   # Encapsulated vehicle class
│   ├── Service.h                   # Abstract service base class
│   ├── BasicService.h              # Derived basic service class
│   ├── PremiumService.h            # Derived premium service class
│   ├── EmergencyService.h          # Derived emergency service class
│   ├── MaintenancePlanner.h        # Overloaded predictive maintenance planner
│   ├── VehicleHealthAnalyzer.h     # 0-100 Health scoring & diagnostic engine
│   ├── DataManager.h               # File persistence & repository layer
│   ├── AppController.h             # UI / Backend state coordinator
│   └── GUIApp.h                    # Native Win32 / GDI+ Desktop GUI engine
└── src/                            # C++ Implementation Files
    ├── Person.cpp
    ├── Customer.cpp
    ├── Vehicle.cpp
    ├── Service.cpp
    ├── BasicService.cpp
    ├── PremiumService.cpp
    ├── EmergencyService.cpp
    ├── MaintenancePlanner.cpp
    ├── VehicleHealthAnalyzer.cpp
    ├── DataManager.cpp
    ├── AppController.cpp
    ├── GUIApp.cpp
    └── main.cpp                    # Application entry point
```

---

## 🚀 Installation & How to Run

### Prerequisites
* **Windows 10 / 11**
* **GCC / MinGW C++17** (or portable `w64devkit`)

### Option 1: 1-Click Batch Build (Recommended)
1. Double-click or run `build.bat`:
   ```cmd
   build.bat
   ```
2. Launch the desktop GUI:
   ```cmd
   run.bat
   ```

### Option 2: CLI Demonstration Mode
To execute the automated end-to-end verification and view all OOP calculations in the terminal:
```cmd
bin\AutoCare360.exe --demo
```

### Option 3: Using Make or CMake
```bash
# Using Make
make
./bin/AutoCare360.exe

# Using CMake
mkdir build && cd build
cmake ..
cmake --build .
```

---

## 🖥️ Screen-by-Screen Walkthrough

| Screen | Title | Key Features |
| :--- | :--- | :--- |
| **Screen 1** | **Splash / Welcome Screen** | Brand badge, system architecture badges, "Launch Dashboard" button. |
| **Screen 2** | **Executive Dashboard** | 4 KPI summary cards (Total Fleet, Services Due, Completed, High Priority), recent polymorphic work orders table, quick service launcher. |
| **Screen 3** | **Vehicle Fleet & Registration** | Form with validated inputs, duplicate registration prevention, interactive fleet table with selection highlight. |
| **Screen 4** | **Customer Directory & Profiles** | Client contact profiles, vehicle ownership association, add/update/delete operations. |
| **Screen 5** | **Smart Predictive Planner** | Overloaded calculation engine, vehicle category intervals, priority badges (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), estimated service date. |
| **Screen 6** | **Service Booking & Polymorphic Estimator** | Polymorphic tier selector (Basic, Premium, Emergency), dynamic parameter forms, live cost simulation via dynamic dispatch. |
| **Screen 7** | **Vehicle Health Monitor (0–100 AI)** | Circular animated gauge, color-coded health badges, component telemetry (Engine, Brakes, Battery, Suspension), actionable advice. |
| **Screen 8** | **Service History & Telemetry** | Full service history table with filters (`ALL`, `Basic`, `Premium`, `Emergency`), polymorphic cost totals. |
| **Screen 9** | **Analytical Reports & Export** | 5 detailed reports (Vehicle, Customer, Maintenance, High-Priority, Financial), live mono previewer, 1-click export to `reports/`. |

---

## 👥 Authors & Academic Context

* **Course**: DSA0111 – Implementation and Evaluation of Object-Oriented Programming Concepts Using C++
* **Faculty In-charge**: K. Veena Devi
* **Project**: AutoCare 360 – Smart Vehicle Service and Maintenance Management System

---

## 🔮 Future Enhancements

1. **OBD-II Bluetooth Sensor Integration**: Real-time live CAN bus vehicle diagnostic stream reader.
2. **Cloud Synchronization**: RESTful API connector to sync fleet telemetry across distributed service branches.
3. **Machine Learning Failure Predictor**: Neural network regression for component wear prediction based on ambient weather and driving styles.
