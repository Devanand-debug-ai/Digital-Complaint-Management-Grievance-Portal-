import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../core/services/complaint.service';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent implements OnInit {
  complaints: any[] = [];
  feedbackComplaint: any = null;
  feedbackText: string = '';
  feedbackRating: number = 5;

  constructor(private complaintService: ComplaintService) { }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints() {
    this.complaintService.getComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
      },
      error: (err) => console.error(err)
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Resolved': return 'green';
      case 'In-progress': return 'orange';
      case 'Assigned': return 'blue';
      default: return 'red';
    }
  }

  openFeedbackForm(complaint: any) {
    this.feedbackComplaint = complaint;
    this.feedbackText = '';
    this.feedbackRating = 5;
  }

  closeFeedbackForm() {
    this.feedbackComplaint = null;
  }

  submitFeedback() {
    if (!this.feedbackText.trim()) return;

    this.complaintService.submitFeedback(
      this.feedbackComplaint.id,
      this.feedbackText,
      this.feedbackRating
    ).subscribe({
      next: () => {
        this.feedbackComplaint.feedback = this.feedbackText;
        this.feedbackComplaint.feedbackRating = this.feedbackRating;
        this.closeFeedbackForm();
        this.loadComplaints();
      },
      error: (err) => console.error(err)
    });
  }
}
