import { supabase } from './db/supabase.js';
import { CURRENT_USER_ID } from './config.js';

let chartInstance = null; // Global variable to store the current chart.js instance

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Fetch data from the backend API (Supabase)
    supabase.from('tips').select('*').order('date', { ascending: true })
        .then(({ data, error }) => {
            if (error) {
                console.error("Error fetching data:", error);
                const app = document.getElementById("app");
                if (app) {
                    app.innerHTML = "<p>Failed to fetch data.</p>";
                }
                return;
            }
        
            // Handle case where no data is returned
            if(!data || data.length === 0) {
                const app = document.getElementById("app");
                if (app) {
                    app.innerHTML = "<p>No data avaliable.</p>";
                }
                return;
            }

            // Initialize filters and dashboard content
            setupFilters(data);
            initializeDashboard(data);

            // Re-render when chart type changes
            document.getElementById("chart-type-selector").onchange = () => filterAndRenderData(data);
        })

        // Input Shift button functionality
        const saveShiftBtn = document.getElementById("save-shift-btn");

        if (saveShiftBtn) {
            saveShiftBtn.addEventListener("click", async function() {
                // Get form values
                const date = document.getElementById("shift-date").value;
                const dayOfWeek = document.getElementById("shift-day").value;
                const amOrPm = document.getElementById("shift-period").value;
                const hoursWorked = parseFloat(document.getElementById("shift-hours").value);
                const tipsEarned = parseFloat(document.getElementById("shift-tips").value);

                // Validate
                if (!date || !dayOfWeek || !amOrPm || !hoursWorked || !tipsEarned) {
                    alert("Please fill out all fields");
                    return;
                }

                // Insert into Supabase
                const { data, error } = await supabase
                    .from("tips")
                    .insert([{
                        user_id: CURRENT_USER_ID,
                        date: date,
                        day_of_week: dayOfWeek,
                        am_or_pm: amOrPm,
                        hours_worked: hoursWorked,
                        tips_earned: tipsEarned
                    }])
                    .select();

                if (error) {
                    console.error("Error saving shift:", error);
                    alert("Failed to save shift: " + error.message);
                    return;
                }

                console.log("Shift saved succesfully:", data);
                alert("Shift saved successfully!");

                // Close modal
                $("#shiftModal").modal("hide");

                // Clear form
                document.getElementById("shift-form").reset();

                // Refresh the page to show new data
                window.location.reload();
            })
        }
});

// Initlialize Flatpickr date pickers and category filter
function setupFilters(data) {
    // Convert date strings to JS Date objects
    const dates = data.map((item) => new Date(item.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Configure start date picker
    flatpickr("#start-date", {
        defaultDate: minDate.toISOString().slice(0, 10),
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        onChange: function () {
            filterAndRenderData(data);
        },
    });

    // Configure end date picker
    flatpickr("#end-date", {
        defaultDate: maxDate.toISOString().slice(0, 10),
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        onChange: function () {
            filterAndRenderData(data);
        },
    });

    // Set up category dropdown change listener
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
        categoryFilter.onchange = () => filterAndRenderData(data);
    }
}

// Initialize dashboard after filters are set
function initializeDashboard(data) {
    populateCategoryFilter(data); // Populate category dropdown
    filterAndRenderData(data); // Initial render with all data
}

// Apply filters and update key metrics, chart, and table
function filterAndRenderData(data) {
    const chartType = document.getElementById('chart-type-selector').value;
    const startDate = document.getElementById('start-date')._flatpickr.selectedDates[0];
    const endDate = document.getElementById('end-date')._flatpickr.selectedDates[0];
    const selectedCategory = document.getElementById('category-filter').value;

    // Filter date by category
    const filteredData = data.filter((item) =>  {
        // Parse date as local date, not UTC
        const [year, month, day] = item.date.split('-');
        const itemDate = new Date(year, month - 1, day); // month is 0-indexed
        return (
            itemDate >= startDate &&
            itemDate <= endDate
            //(selectedCategory === 'all' || item.categories === selectedCategory)
        );
    });

    updateKeyMetrics(filteredData); // Update metrics like Total Tips and Average Tips
    drawChart(filteredData, 'chart-canvas', chartType); // Render chart
    populateDataTable(filteredData); // Update table
}

// Update dashboard metrics
function updateKeyMetrics(data) {
    const totalTips = data.reduce((acc, item) => acc + parseFloat(item.tips_earned), 0);
    const averageTips = totalTips / data.length;

    // Display metrics in the DOM
    document.getElementById("total-tips").textContent = `$${totalTips.toFixed(2)}`;
    document.getElementById("average-tips").textContent = `$${averageTips.toFixed(2)}`;
}

// Draw the selected chart type using Chart.js
function drawChart(data, elementId, chartType) {
    const ctx = document.getElementById(elementId).getContext('2d');

    // Destroy previous chart if one exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    switch (chartType) {
        case "tipsOverTime":
            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.map((item) => item.date),
                    datasets: [{
                        label: "Tips Over Time",
                        data: data.map((item) => parseFloat(item.tips_earned)),
                        fill: false,
                        borderColor: "rgb(0, 255, 65)",
                        tension: 0.1,
                    }],
                },
                options: {
                    scales: {
                        y: { beginAtZero: true},
                    },
                },
            });
            break;
    }
}

// Display filtered data in a DataTable
function populateDataTable(data) {
    const tableElement = $("#data-table");

    // Destroy existing table if it exists
    if ($.fn.DataTable.isDataTable(tableElement)) {
        tableElement.DataTable().clear().destroy();
    }

    // Create a new DataTable with relevant columns
    tableElement.DataTable({
        data: data.map((item) => [
            item.date,
            item.day_of_week,
            item.am_or_pm,
            item.hours_worked,
            item.tips_earned,
        ]),
        columns: [
            { title: "Date" },
            { title: "Day" },
            { title: "AM or PM" },
            { title: "Hours Worked" },
            { title: "Tips Earned" },
        ],
    });
}

// Populate the category filter dropdown with all availble categories
function populateCategoryFilter(data) {
    const categoryFilter = document.getElementById("category-filter");
    categoryFilter.innerHTML = '';
    categoryFilter.appendChild(new Option("All Categories", "all", true, true));

    // Extract unique categories
    //const categories = new Set(data.map((item) => item.categories));
    //categories.forEach((category) => {
    //    categoryFilter.appendChild(new Option(category, category));
    //});
}
