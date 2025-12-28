import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ComplaintService } from '../../core/services/complaint.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  complaints: any[] = [];
  filteredComplaints: any[] = [];
  paginatedComplaints: any[] = [];

  // Stats
  totalGrievances = 0;
  pendingGrievances = 0;
  closedGrievances = 0;

  // Pagination & Search
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;
  searchQuery = '';
  Math = Math;

  // Feedback Dialog
  selectedRating = 0;
  feedbackComment = '';
  @ViewChild('feedbackDialog') feedbackDialog: any;

  constructor(
    private authService: AuthService,
    private complaintService: ComplaintService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints() {
    this.complaintService.getComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.calculateStats();
        this.filterComplaints();
      },
      error: (err) => console.error(err)
    });
  }

  calculateStats() {
    this.totalGrievances = this.complaints.length;
    this.closedGrievances = this.complaints.filter(c => c.status === 'Resolved').length;
    this.pendingGrievances = this.totalGrievances - this.closedGrievances;
  }

  filterComplaints() {
    let temp = this.complaints;

    // Search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      temp = temp.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.id && c.id.toString().includes(query))
      );
    }

    this.filteredComplaints = temp;
    this.totalPages = Math.ceil(this.filteredComplaints.length / this.pageSize);
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedComplaints = this.filteredComplaints.slice(startIndex, startIndex + this.pageSize);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.filterComplaints();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.filterComplaints();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Feedback Methods
  openFeedbackDialog(complaint: any) {
    this.selectedRating = 0;
    this.feedbackComment = '';

    const dialogRef = this.dialog.open(this.feedbackDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitFeedback(complaint);
      }
    });
  }

  submitFeedback(complaint: any) {
    this.complaintService.submitFeedback(complaint.id, this.feedbackComment, this.selectedRating).subscribe({
      next: (res) => {
        this.snackBar.open('Feedback Submitted Successfully', 'Close', { duration: 3000 });
        complaint.feedback = this.feedbackComment;
        complaint.feedbackRating = this.selectedRating;
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to submit feedback', 'Close', { duration: 3000 });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
