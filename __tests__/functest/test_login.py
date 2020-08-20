# from unittest import main, TestCase
# from selenium.webdriver.common.keys import Keys
# import time

# TEST_EMAIL = 'yoonsung0711@gmail.com'
# SUBJECT = 'Your login link for Superlists'

# class LoginTest(TestCase):
    # def test_can_get_email_link_to_log_in(self):
    #     self.browser.get('http://localhost:5000')
    #     self.browser.find_element_by_name('email').send_keys(TEST_EMAIL)
    #     self.browser.find_element_by_name('email').send_keys(Keys.ENTER)

    #     self.wait_for(lambda: self.assertIn(
    #         'Check your email', 
    #         self.browser.find_element_by_tag_name('body').text
    #     ))

    #     email = mail.outbox[0]  
    #     self.assertIn(TEST_EMAIL, email.to)
    #     self.assertEqual(email.subject, SUBJECT)

    #     self.assertIn('Use this link to log in', email.body)
    #     url_search = re.search(r'http://.+/.+$', email.body)
    #     if not url_search:
    #         self.fail(f'Could not find url in email body:\n{email.body}')
    #     url = url_search.group(0)
    #     self.assertIn(self.live_server_url, url)

    #     self.browser.get(url)

    #     self.wait_for(
    #         lambda: self.browser.find_element_by_link_text('Log out')
    #     )
    #     navbar = self.browser.find_element_by_css_selector('.navbar')
    #     self.assertIn(TEST_EMAIL, navbar.text)


    # def test_login_with_id_and_password(self):
    #     self.browser.get('http://localhost:5000/')
    #     self.browser.find_element_by_id('id_login').click()

    #     self.switch_to_new_window('Login To ToDo')
    #     self.browser.find_element_by_id('authentication_email').send_keys('yoonsung0711@gmail.com')
    #     self.browser.find_element_by_tag_name('button').click()

    #     self.switch_to_new_window('To-Do')

    #     self.wait_for_element_with_id('id_logout')
    #     navbar = self.browser.find_element_by_css_selector('.navbar')
    #     self.assertIn('yoonsung0711@gmail.com', navbar.text)

    # def switch_to_new_window(self, text_in_title):
    #     retries = 60
    #     while retries > 0:
    #         for handle in self.browser.window_handles:
    #             self.browser.switch_to_window(handle)
    #             if text_in_title in self.browser.title:
    #                 return
    #         retries -= 1
    #         time.sleep(0.5)
    #     self.fail('창을 닫을 수 없습니다.')


