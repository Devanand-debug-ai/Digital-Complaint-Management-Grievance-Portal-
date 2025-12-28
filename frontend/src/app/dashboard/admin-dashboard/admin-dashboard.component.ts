import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../core/services/complaint.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  complaints: any[] = [];
  users: any[] = [];
  staffList: any[] = [];
  analytics: any = null;
  statuses = ['Open', 'Assigned', 'In-progress', 'Resolved'];

  // New staff form data
  newStaff = {
    name: '',
    email: '',
    password: '',
    department: 'General',
    contact_info: ''
  };
  showStaffForm = false;

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAnalytics();
    this.loadComplaints();
    this.loadUsers();
    this.loadStaff();
  }

  loadAnalytics() {
    this.complaintService.getAnalytics().subscribe({
      next: (data) => this.analytics = data,
      error: (err) => console.error(err)
    });
  }

  loadComplaints() {
    this.complaintService.getComplaints().subscribe({
      next: (data) => this.complaints = data,
      error: (err) => console.error(err)
    });
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error(err)
    });
  }

  loadStaff() {
    this.authService.getStaffList().subscribe({
      next: (data) => this.staffList = data,
      error: (err) => console.error(err)
    });
  }

  updateStatus(complaint: any, newStatus: string) {
    this.complaintService.updateStatus(complaint.id, newStatus).subscribe({
      next: () => {
        complaint.status = newStatus;
        this.snackBar.open('Status Updated', 'Close', { duration: 2000 });
        this.loadAnalytics();
      },
      error: () => this.snackBar.open('Update Failed', 'Close', { duration: 2000 })
    });
  }

  assignStaff(complaint: any, staffId: number) {
    const newStatus = complaint.status === 'Open' ? 'Assigned' : complaint.status;
    this.complaintService.updateStatus(complaint.id, newStatus, staffId).subscribe({
      next: () => {
        complaint.staffId = staffId;
        complaint.status = newStatus;
        this.snackBar.open('Staff Assigned', 'Close', { duration: 2000 });
        this.loadAnalytics();
        this.loadComplaints();
        this.loadStaff(); // Reload staff to update busy status
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Assignment Failed', 'Close', { duration: 3000 });
        // Revert selection if failed
        this.loadComplaints();
      }
    });
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.authService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.snackBar.open('User Deleted', 'Close', { duration: 2000 });
          this.loadAnalytics();
        },
        error: () => this.snackBar.open('Delete Failed', 'Close', { duration: 2000 })
      });
    }
  }

  createStaff() {
    if (!this.newStaff.name || !this.newStaff.email || !this.newStaff.password) {
      this.snackBar.open('Please fill required fields', 'Close', { duration: 2000 });
      return;
    }

    this.authService.createStaff(this.newStaff).subscribe({
      next: () => {
        this.snackBar.open('Staff Created Successfully', 'Close', { duration: 2000 });
        this.loadStaff();
        this.showStaffForm = false;
        this.newStaff = { name: '', email: '', password: '', department: 'General', contact_info: '' };
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Creation Failed', 'Close', { duration: 2000 })
    });
  }

  deleteStaff(staff: any) {
    if (confirm(`Are you sure you want to delete staff member ${staff.name}?`)) {
      this.authService.deleteStaff(staff.id).subscribe({
        next: () => {
          this.staffList = this.staffList.filter(s => s.id !== staff.id);
          this.snackBar.open('Staff Deleted', 'Close', { duration: 2000 });
          this.loadAnalytics();
        },
        error: () => this.snackBar.open('Delete Failed', 'Close', { duration: 2000 })
      });
    }
  }

  toggleStaffForm() {
    this.showStaffForm = !this.showStaffForm;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getComplaintsWithFeedback(): any[] {
    return this.complaints.filter(c => c.feedback || c.feedbackRating);
  }

  getAvailableStaff(complaint: any): any[] {
    if (!complaint.category) return this.staffList;

    // Mapping from Complaint Category to Staff Department(s)
    const categoryMap: { [key: string]: string[] } = {
      'Plumbing': ['Plumber'],
      'Electrical': ['Electrician'],
      'Carpentry': ['Carpenter'],
      'Painting': ['Painter'],
      'Internet': ['Internet Technician'],
      'Facility': ['Carpenter', 'Painter', 'Plumber', 'Electrician', 'General'],
      'Other': ['General']
    };

    const allowedDepartments = categoryMap[complaint.category];

    return this.staffList.filter(staff => {
      // 1. Filter by Department (Skill)
      let matchesSkill = false;
      if (allowedDepartments) {
        matchesSkill = allowedDepartments.includes(staff.department);
      } else {
        // Fallback: Exact match or "General"
        matchesSkill = staff.department === complaint.category || staff.department === 'General';
      }

      // 2. Filter by Availability
      const isAvailable = !staff.isBusy || staff.id === complaint.staffId;

      return matchesSkill && isAvailable;
    });
  }
}
