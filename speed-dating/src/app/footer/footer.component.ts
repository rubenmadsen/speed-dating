import { Component } from '@angular/core';
import { faXTwitter, faLinkedin, faFacebook, faYoutube, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  protected readonly facebook = faFacebook
  protected readonly youtube = faYoutube
  protected readonly linkedin = faLinkedin
  protected readonly XTwitter = faXTwitter
  protected readonly instagram = faInstagram
  protected readonly github = faGithub

}
