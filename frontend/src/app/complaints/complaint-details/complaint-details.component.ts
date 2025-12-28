import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from '../../core/services/complaint.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.scss']
})
export class ComplaintDetailsComponent {
  complaintForm: FormGroup;
  categories = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Internet', 'Facility', 'Other'];

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.complaintForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      attachments: [''] // Optional URL
    });
  }

  onSubmit(): void {
    if (this.complaintForm.valid) {
      this.complaintService.createComplaint(this.complaintForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Complaint Submitted Successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard/user']);
        },
        error: (err) => {
          this.snackBar.open('Submission Failed: ' + (err.error.message || 'Server Error'), 'Close', { duration: 3000 });
        }
      });
    }
  }
}
