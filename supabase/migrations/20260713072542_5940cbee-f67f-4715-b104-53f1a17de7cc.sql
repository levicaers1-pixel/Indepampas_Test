
CREATE POLICY "Sponsor logos are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sponsors');

CREATE POLICY "Admins can upload sponsor logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'sponsors' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update sponsor logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'sponsors' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sponsor logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'sponsors' AND public.has_role(auth.uid(), 'admin'));
