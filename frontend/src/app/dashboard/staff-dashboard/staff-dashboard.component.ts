import { Component, OnInit, ViewChild } from '@angular/core';
import { ComplaintService } from '../../core/services/complaint.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss']
})
export class StaffDashboardComponent implements OnInit {
  complaints: any[] = [];
  statuses = ['Open', 'Assigned', 'In-progress', 'Resolved'];
  staffList: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.getRole() === 'Admin';
    this.loadComplaints();
    if (this.isAdmin) {
      this.loadStaff();
    }
  }

  loadComplaints() {
    this.complaintService.getComplaints().subscribe({
      next: (data) => this.complaints = data,
      error: (err) => console.error(err)
    });
  }

  loadStaff() {
    this.authService.getStaffList().subscribe({
      next: (data) => this.staffList = data,
      error: (err) => console.error(err)
    });
  }

  // Dialog properties
  resolutionNotes: string = '';
  @ViewChild('resolutionDialog') resolutionDialog: any;

  updateStatus(complaint: any, newStatus: string) {
    if (newStatus === 'Resolved') {
      this.openResolutionDialog(complaint);
      return;
    }

    this.complaintService.updateStatus(complaint.id, newStatus).subscribe({
      next: (res) => {
        complaint.status = newStatus;
        this.snackBar.open('Status Updated Successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Update Failed', 'Close', { duration: 2000 });
        // Revert selection if failed (optional, but good UX)
        this.loadComplaints();
      }
    });
  }

  openResolutionDialog(complaint: any) {
    this.resolutionNotes = '';
    const dialogRef = this.dialog.open(this.resolutionDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(notes => {
      if (notes) {
        this.submitResolution(complaint, notes);
      } else {
        // Revert selection if cancelled
        this.loadComplaints();
      }
    });
  }

  submitResolution(complaint: any, notes: string) {
    this.complaintService.updateStatus(complaint.id, 'Resolved', undefined, notes).subscribe({
      next: (res) => {
        complaint.status = 'Resolved';
        complaint.resolutionNotes = notes; // Update local model if needed
        this.snackBar.open('Complaint Resolved Successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Resolution Failed', 'Close', { duration: 2000 });
        this.loadComplaints();
      }
    });
  }

  assignStaff(complaint: any, staffId: number) {
    // Determine new status automatically if it was Open
    const newStatus = complaint.status === 'Open' ? 'Assigned' : complaint.status;

    this.complaintService.updateStatus(complaint.id, newStatus, staffId).subscribe({
      next: (res) => {
        complaint.staffId = staffId;
        complaint.status = newStatus;
        this.snackBar.open('Staff Assigned Successfully', 'Close', { duration: 2000 });
        this.loadComplaints(); // Reload to see updated assignment name
      },
      error: (err) => {
        this.snackBar.open('Assignment Failed', 'Close', { duration: 2000 });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
