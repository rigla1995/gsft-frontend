import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/models';

@Directive({ selector: '[appPermission]', standalone: true })
export class PermissionDirective implements OnInit {
  @Input('appPermission') allowedRoles: UserRole[] = [];

  private authService = inject(AuthService);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user && (this.allowedRoles.length === 0 || this.allowedRoles.includes(user.role))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
