# AutoCare 360 – Complete System Pseudocode
## Comprehensive Algorithmic & Procedural Specification for DSA0111

This document outlines the end-to-end pseudocode for **AutoCare 360 – Smart Vehicle Service and Maintenance Management System**, covering data structures, class hierarchies, compile-time and runtime polymorphism, maintenance prediction algorithms, diagnostic scoring, and GUI event handling.

---

```text
================================================================================
MODULE 1: DATA STRUCTURES & CLASS DEFINITIONS
================================================================================

CLASS Person:
    PROTECTED:
        id: INTEGER
        name: STRING
        phone: STRING
        email: STRING
    PUBLIC:
        CONSTRUCTOR(id, name, phone, email)
        VIRTUAL FUNCTION displayInfo()
        VIRTUAL FUNCTION updateInfo(newName, newPhone, newEmail)
        GETTERS and SETTERS with validation
    END CLASS

CLASS Customer INHERITS Person:
    PRIVATE:
        address: STRING
        vehicleIds: LIST of INTEGER
    PUBLIC:
        CONSTRUCTOR(id, name, phone, email, address, vehicleIds)
        FUNCTION addVehicle(vehicleId)
        FUNCTION removeVehicle(vehicleId)
        FUNCTION hasVehicle(vehicleId) -> BOOLEAN
        OVERRIDE FUNCTION displayInfo()
        FUNCTION toDataString() -> STRING
        STATIC FUNCTION fromDataString(dataLine) -> Customer
    END CLASS

CLASS Vehicle:
    PRIVATE:
        vehicleId: INTEGER
        registrationNumber: STRING
        vehicleType: STRING
        brand: STRING
        model: STRING
        year: INTEGER
        kilometers: INTEGER
        ownerId: INTEGER
        lastServiceKm: INTEGER
        lastServiceDate: STRING
    PUBLIC:
        CONSTRUCTOR(id, regNum, type, brand, model, year, km, ownerId, lastKm, lastDate)
        GETTERS and SETTERS (with strict boundary validation)
        FUNCTION updateKilometers(additionalKm) -> BOOLEAN
        FUNCTION recordCompletedService(serviceKm, serviceDate)
        FUNCTION toDataString() -> STRING
        STATIC FUNCTION fromDataString(line) -> Vehicle
    END CLASS

ABSTRACT CLASS Service:
    PROTECTED:
        serviceId: INTEGER
        vehicleId: INTEGER
        vehicleReg: STRING
        serviceDate: STRING
        baseCost: DOUBLE
        kilometerReading: INTEGER
        status: STRING
        notes: STRING
    PUBLIC:
        CONSTRUCTOR(...)
        VIRTUAL DESTRUCTOR()
        PURE VIRTUAL FUNCTION calculateCost() -> DOUBLE
        PURE VIRTUAL FUNCTION getServiceType() -> STRING
        VIRTUAL FUNCTION displayServiceDetails()
        PURE VIRTUAL FUNCTION toDataString() -> STRING
    END CLASS

CLASS BasicService INHERITS Service:
    PRIVATE:
        partsCost: DOUBLE
        oilGrade: STRING
        labourDiscount: DOUBLE
    PUBLIC:
        CONSTRUCTOR(...)
        OVERRIDE FUNCTION calculateCost() -> DOUBLE:
            RETURN (baseCost + partsCost) - labourDiscount
        OVERRIDE FUNCTION getServiceType() -> STRING:
            RETURN "Basic Service"
        OVERRIDE FUNCTION toDataString() -> STRING
    END CLASS

CLASS PremiumService INHERITS Service:
    PRIVATE:
        inspectionFee: DOUBLE
        syntheticOilCharge: DOUBLE
        detailingCharge: DOUBLE
        diagnosticScanFee: DOUBLE
    PUBLIC:
        CONSTRUCTOR(...)
        OVERRIDE FUNCTION calculateCost() -> DOUBLE:
            RETURN baseCost + inspectionFee + syntheticOilCharge + detailingCharge + diagnosticScanFee
        OVERRIDE FUNCTION getServiceType() -> STRING:
            RETURN "Premium Service"
        OVERRIDE FUNCTION toDataString() -> STRING
    END CLASS

CLASS EmergencyService INHERITS Service:
    PRIVATE:
        emergencyTowingFee: DOUBLE
        rapidDiagnosticsCharge: DOUBLE
        overtimeLaborRate: DOUBLE
        isRoadsideAssistance: BOOLEAN
    PUBLIC:
        CONSTRUCTOR(...)
        OVERRIDE FUNCTION calculateCost() -> DOUBLE:
            dispatchFee = 50.0 IF isRoadsideAssistance ELSE 0.0
            RETURN baseCost + emergencyTowingFee + rapidDiagnosticsCharge + overtimeLaborRate + dispatchFee
        OVERRIDE FUNCTION getServiceType() -> STRING:
            RETURN "Emergency Service"
        OVERRIDE FUNCTION toDataString() -> STRING
    END CLASS

================================================================================
MODULE 2: COMPILE-TIME POLYMORPHISM (FUNCTION OVERLOADING)
================================================================================

CLASS MaintenancePlanner:
    // Overloaded Next Service Calculations
    FUNCTION calculateNextService(currentKm: INTEGER) -> INTEGER:
        DEFAULT_INTERVAL = 10000
        remainder = currentKm MOD DEFAULT_INTERVAL
        IF remainder == 0:
            RETURN currentKm + DEFAULT_INTERVAL
        ELSE:
            RETURN currentKm + (DEFAULT_INTERVAL - remainder)
    END FUNCTION

    OVERLOADED FUNCTION calculateNextService(currentKm: INTEGER, vehicleType: STRING, maintenanceType: STRING) -> INTEGER:
        interval = getRecommendedInterval(vehicleType, maintenanceType)
        remainder = currentKm MOD interval
        IF remainder == 0:
            RETURN currentKm + interval
        ELSE:
            RETURN currentKm + (interval - remainder)
    END FUNCTION

    // Overloaded Priority Determination
    FUNCTION determinePriority(currentKm: INTEGER, lastServiceKm: INTEGER, serviceIntervalKm: INTEGER) -> STRING:
        kmSinceLast = currentKm - lastServiceKm
        overdueKm = kmSinceLast - serviceIntervalKm
        IF overdueKm > 3000:
            RETURN "CRITICAL"
        ELSE IF overdueKm > 500:
            RETURN "HIGH"
        ELSE IF overdueKm > -1000:
            RETURN "MEDIUM"
        ELSE:
            RETURN "LOW"
    END FUNCTION

    OVERLOADED FUNCTION determinePriority(currentKm: INTEGER, lastServiceKm: INTEGER, maintenanceType: STRING, healthScore: INTEGER) -> STRING:
        interval = getRecommendedInterval("Generic", maintenanceType)
        kmSinceLast = currentKm - lastServiceKm
        isSafetyCritical = (maintenanceType == "Brake Inspection" OR maintenanceType == "Engine Service")

        IF kmSinceLast > interval + 2500 OR healthScore < 40 OR (isSafetyCritical AND kmSinceLast > interval):
            RETURN "CRITICAL"
        ELSE IF kmSinceLast >= interval OR healthScore < 60:
            RETURN "HIGH"
        ELSE IF kmSinceLast >= interval - 1500 OR healthScore < 80:
            RETURN "MEDIUM"
        ELSE:
            RETURN "LOW"
    END FUNCTION

    FUNCTION calculateEstimatedDate(currentKm: INTEGER, nextServiceKm: INTEGER, avgKmPerMonth: INTEGER) -> STRING:
        diffKm = nextServiceKm - currentKm
        IF diffKm <= 0:
            RETURN "Immediate Service Required"
        monthsRemaining = diffKm / avgKmPerMonth
        daysRemaining = monthsRemaining * 30.4
        RETURN CURRENT_DATE + daysRemaining
    END FUNCTION
END CLASS

================================================================================
MODULE 3: VEHICLE HEALTH ANALYTICS ENGINE (0 - 100 SCORING)
================================================================================

CLASS VehicleHealthAnalyzer:
    FUNCTION calculateOverallScore(vehicle: Vehicle, serviceCount: INTEGER, overdueCount: INTEGER) -> INTEGER:
        score = 100
        
        // Mileage deduction
        IF vehicle.kilometers > 20000:
            deduction = (vehicle.kilometers - 20000) / 5000
            score = score - MIN(deduction, 25)
            
        // Age deduction
        age = 2026 - vehicle.year
        IF age > 3:
            deduction = (age - 3) * 2
            score = score - MIN(deduction, 20)
            
        // Service Interval degradation
        kmSinceService = vehicle.kilometers - vehicle.lastServiceKm
        IF kmSinceService > 15000:
            score = score - 20
        ELSE IF kmSinceService > 10000:
            score = score - 12
        ELSE IF kmSinceService > 7500:
            score = score - 6
            
        // Overdue maintenance penalty
        score = score - (overdueCount * 15)
        
        // Loyalty maintenance bonus
        score = score + MIN(serviceCount * 2, 10)
        
        RETURN CLAMP(score, 5, 100)
    END FUNCTION

    FUNCTION determineHealthStatus(score: INTEGER) -> STRING:
        IF score >= 80: RETURN "Excellent"
        ELSE IF score >= 60: RETURN "Good"
        ELSE IF score >= 40: RETURN "Needs Attention"
        ELSE: RETURN "Critical"
    END FUNCTION
END CLASS

================================================================================
MODULE 4: PERSISTENCE & DATA MANAGER
================================================================================

CLASS DataManager:
    PRIVATE:
        customers: LIST of Customer
        vehicles: LIST of Vehicle
        services: LIST of SHARED_PTR to Service
        planner: MaintenancePlanner
        analyzer: VehicleHealthAnalyzer

    FUNCTION loadAllData():
        READ "data/customers.txt" -> POPULATE customers
        READ "data/vehicles.txt" -> POPULATE vehicles
        READ "data/services.txt" -> PARSE polymorphism tokens -> INSTANTIATE Basic/Premium/Emergency -> POPULATE services
        IF all lists are empty:
            POPULATE default sample dataset
            saveAllData()
    END FUNCTION

    FUNCTION saveAllData():
        WRITE customers TO "data/customers.txt"
        WRITE vehicles TO "data/vehicles.txt"
        WRITE services TO "data/services.txt" USING s->toDataString()
    END FUNCTION

    // Overloaded Find Operations
    FUNCTION findVehicle(vehicleId: INTEGER) -> Vehicle POINTER
    FUNCTION findVehicle(regNumber: STRING) -> Vehicle POINTER
    FUNCTION findCustomer(customerId: INTEGER) -> Customer POINTER
    FUNCTION findCustomer(nameOrPhone: STRING) -> Customer POINTER

    // Dynamic Polymorphic Revenue Calculation
    FUNCTION calculateTotalRevenue() -> DOUBLE:
        total = 0.0
        FOR EACH service IN services:
            total = total + service->calculateCost()  // RUNTIME POLYMORPHIC DISPATCH
        END FOR
        RETURN total
    END FUNCTION
END CLASS

================================================================================
MODULE 5: MAIN APPLICATION WORKFLOW & GUI LOOP
================================================================================

START PROGRAM:
    INITIALIZE controller
    LOAD data from persistent storage
    
    IF argument IS "--demo" OR "--cli":
        DISPLAY Welcome Header
        DISPLAY Customer Directory
        DISPLAY Fleet Inventory
        DISPLAY Polymorphic Services & Total Calculated Cost
        DISPLAY Maintenance Predictions
        DISPLAY Health Diagnostic Scores
        EXIT PROGRAM (0)
    END IF

    CREATE Native GUI Window (1280x800, Double-Buffered GDI)
    SET activeScreen = SPLASH

    WHILE Window Message Loop IS ACTIVE:
        GET Window Message
        
        ON PAINT:
            IF activeScreen == SPLASH:
                RENDER AutoCare 360 Logo, Tagline, Feature Badges
                RENDER "LAUNCH DASHBOARD" Button
            ELSE:
                RENDER Sidebar Navigation (9 Screen Tabs)
                RENDER Header Bar with Screen Title & Status Badges
                RENDER Status Message Bar
                
                SWITCH (activeScreen):
                    CASE DASHBOARD:
                        RENDER 4 KPI Cards (Total Fleet, Services Due, Completed, High Priority)
                        RENDER Recent Services Polymorphic Table
                        RENDER Quick Action Buttons
                    CASE VEHICLES:
                        RENDER Vehicle Form (ID, Reg, Type, Brand, Model, Year, Km, Owner)
                        RENDER Add, Update, Delete Buttons
                        RENDER Fleet Inventory Table with Selection Highlighting
                    CASE CUSTOMERS:
                        RENDER Customer Profile Form
                        RENDER Client Directory with Associated Vehicle Counts
                    CASE MAINTENANCE_PLANNER:
                        RENDER Target Vehicle & Maintenance Type Selectors
                        COMPUTE Overloaded Next Service Km, Priority & Due Date
                        RENDER Smart Advisory Matrix
                    CASE SERVICE_MANAGEMENT:
                        RENDER Polymorphic Tier Selector (Basic / Premium / Emergency)
                        RENDER Dynamic Form Inputs per Subclass
                        RENDER Real-time Cost Preview via Dynamic Dispatch
                    CASE VEHICLE_HEALTH:
                        RENDER Fleet Selector
                        RENDER Circular Gauge (0-100 Score) with Status Color
                        RENDER Powertrain, Brakes, Battery, Suspension Health Bars
                        RENDER Action Recommendation
                    CASE SERVICE_HISTORY:
                        RENDER Filter Buttons (ALL, Basic, Premium, Emergency)
                        RENDER Filtered Telemetry Logs Table
                    CASE REPORTS:
                        RENDER 5 Report Generation Buttons
                        RENDER Live Formatted Document Preview
                        RENDER "Export All Reports to Disk" Button
                    CASE SETTINGS:
                        RENDER Active Storage Paths & Database Status
                        RENDER Commit and Reload Buttons
                END SWITCH
            END IF

        ON MOUSE_CLICK(x, y):
            IDENTIFY Clicked UI Button
            IF Sidebar Tab Clicked:
                activeScreen = Selected Tab Screen
            ELSE IF Splash Start Clicked:
                activeScreen = DASHBOARD
            ELSE IF Add/Update/Delete Clicked:
                EXECUTE Corresponding Controller Action
                UPDATE Persistent Database
                REFRESH UI
            ELSE IF Book Service Clicked:
                INSTANTIATE Appropriate Derived Service Object
                DISPATCH polymorphic calculateCost()
                APPEND to services list
                SAVE data
            ELSE IF Export Report Clicked:
                GENERATE formatted text
                WRITE TO "reports/*.txt"
            END IF

        ON KEY_PRESS / CHAR_INPUT:
            UPDATE Active Form Input Buffer
            TRIGGER Live UI Repaint

    END WHILE

    SAVE all databases to disk
    CLEANUP allocated GDI resources
END PROGRAM
```
