import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../auth/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  dropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      // Fermer le dropdown si l'utilisateur se déconnecte
      if (!user) {
        this.dropdownOpen = false;
      }
    });

    // Vérifier l'état initial
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.getElementById('userDropdown');
    const menu = dropdown?.nextElementSibling as HTMLElement;
    
    // Fermer le dropdown si on clique en dehors
    if (this.dropdownOpen && dropdown && menu) {
      if (!dropdown.contains(target) && !menu.contains(target)) {
        this.dropdownOpen = false;
      }
    }
  }

  toggleDropdown(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    // Confirmer la déconnexion (optionnel)
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.dropdownOpen = false;
      this.authService.logout();
    }
  }
}
