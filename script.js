const { createApp } = Vue;

createApp({
    data() {
        return {
            darkMode: false,
            activeTab: 'overview',
            isDragOver: false,
            selectedFile: null,
            isLoadingDemo: false,
            tabs: [
                {
                    id: 'overview',
                    name: 'Overview',
                    icon: 'far fa-circle'
                },
                {
                    id: 'dashboard',
                    name: 'Dashboard',
                    icon: 'fas fa-chart-bar'
                },
                {
                    id: 'data-table',
                    name: 'Data Table',
                    icon: 'fas fa-table'
                }
            ]
        };
    },
    mounted() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.darkMode = savedTheme === 'dark';
        } else {
            // Check system preference
            this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.updateTheme();
    },
    methods: {
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            this.updateTheme();
            localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        },
        updateTheme() {
            if (this.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        handleFileDrop(event) {
            this.isDragOver = false;
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        },
        handleFileSelect(event) {
            const files = event.target.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        },
        processFile(file) {
            // Validate file type
            const allowedTypes = ['.log', '.txt', '.zip', '.gz'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!allowedTypes.includes(fileExtension)) {
                alert('Please select a valid log file (.log, .txt, .zip, .gz)');
                return;
            }
            
            // Validate file size (100MB limit)
            const maxSize = 100 * 1024 * 1024; // 100MB in bytes
            if (file.size > maxSize) {
                alert('File size exceeds 100MB limit');
                return;
            }
            
            this.selectedFile = file;
            
            // Here you would typically upload the file or process it
            console.log('File selected:', file.name, 'Size:', this.formatFileSize(file.size));
            
            // Show success message
            this.showNotification('File uploaded successfully!', 'success');
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        async loadDemo() {
            if (this.isLoadingDemo) return;
            
            this.isLoadingDemo = true;
            
            try {
                this.showNotification('Loading demo dataset...', 'info');
                
                const response = await fetch('https://raw.githubusercontent.com/Yadav-Aayansh/gramener-datasets/refs/heads/add-server-logs/server_logs.zip');
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch demo dataset: ${response.statusText}`);
                }
                
                const blob = await response.blob();
                const file = new File([blob], 'server_logs.zip', { type: 'application/zip' });
                
                // Process the downloaded file
                await this.processDownloadedFile(file);
                
                this.showNotification(`Demo dataset "${file.name}" loaded successfully!`, 'success');
                
            } catch (error) {
                console.error('Failed to load demo dataset:', error);
                this.showNotification(`Failed to load demo dataset: ${error.message}`, 'error');
            } finally {
                this.isLoadingDemo = false;
            }
        },
        async processDownloadedFile(file) {
            const fileName = file.name.toLowerCase();
            
            // Check if file is compressed
            if (fileName.endsWith('.zip') || fileName.endsWith('.gz')) {
                try {
                    // For ZIP files, we'll use JSZip library (would need to be included)
                    // For now, we'll just set the file as selected and show info
                    this.selectedFile = file;
                    this.showNotification('Compressed file detected. Ready for processing.', 'info');
                } catch (error) {
                    throw new Error(`Failed to process compressed file: ${error.message}`);
                }
            } else {
                // For uncompressed files, directly set as selected
                this.selectedFile = file;
            }
        },
        showNotification(message, type = 'info') {
            // Simple notification system
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 
                'bg-blue-500'
            }`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }
    }
}).mount('#app');