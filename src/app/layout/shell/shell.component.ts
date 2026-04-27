import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="shell-layout">
      <app-sidebar class="shell-sidebar" />
      <div class="shell-main">
        <app-navbar />
        <main class="shell-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .shell-sidebar {
      flex-shrink: 0;
    }
    .shell-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .shell-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: #f5f5f5;
    }

    @media (max-width: 1024px) {
      .shell-sidebar { width: 200px; }
    }
  `],
})
export class ShellComponent {}
