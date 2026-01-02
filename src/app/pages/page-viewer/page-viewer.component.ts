// src/app/components/page-viewer/page-viewer.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services/page.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-page-viewer',
  imports: [CommonModule, NavbarComponent, FooterComponent],
  standalone: true,
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.css'],
  
})
export class PageViewerComponent implements OnInit {
  content: string = '';
  notFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pageservice: PageService,
    private titleService: Title,
    private metaService: Meta
  ) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const slug = params.get('slug');
    if (slug) {
      this.pageservice.getPageBySlug(slug).subscribe({
        next: data => {
          this.titleService.setTitle(data.meta_title || data.title);
          this.metaService.updateTag({ name: 'description', content: data.meta_description || '' });
          this.metaService.updateTag({ name: 'keywords', content: data.meta_keywords || '' });
          this.content = data.content;
        },
        error: err => {
          if (err.status === 404) {
            this.notFound = true;
          } else {
            console.error('Error loading page:', err);
          }
        }
      });
    } else {
      this.notFound = true;
    }
  });
}

}
